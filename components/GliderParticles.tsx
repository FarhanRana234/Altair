"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Preload, useGLTF } from "@react-three/drei";
import {
  LOCAL_GLIDER_URL,
  decomposeMatrix,
  normalizingMatrix,
} from "../lib/gltf";

export type VisualMode = "particles" | "solid";

export type GliderTarget = {
  x: number;
  y: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
};

useGLTF.preload(LOCAL_GLIDER_URL);

// Keep the mobile silhouette light while giving desktop enough points for a clear nose and wings.
const PARTICLE_COUNT = 18000;

const vertexShader = `
  attribute vec3 a_target;
  attribute float a_size;
  uniform float u_time;
  uniform float u_transition;
  uniform vec3 u_mouse;
  varying vec3 v_color;
  varying float v_alpha;

  void main() {
    vec3 base = mix(position, a_target, smoothstep(0.0, 1.0, u_transition));
    vec4 baseView = modelViewMatrix * vec4(base, 1.0);
    vec4 baseClip = projectionMatrix * baseView;
    vec2 baseNdc = baseClip.xy / max(abs(baseClip.w), 0.0001);
    vec2 pointerDelta = baseNdc - u_mouse.xy;
    float influence = exp(-dot(pointerDelta, pointerDelta) * 18.0);
    vec3 forceDirection = normalize(vec3(pointerDelta, 0.0001));
    vec3 displaced = base + forceDirection * influence * 0.13;
    displaced.y += sin(u_time * 0.55 + position.x * 8.0) * 0.004;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = a_size * (300.0 / max(1.0, -mvPosition.z));
    v_color = color;
    v_alpha = 0.72 + influence * 0.28;
  }
`;

const fragmentShader = `
  uniform sampler2D u_map;
  varying vec3 v_color;
  varying float v_alpha;

  void main() {
    vec4 texel = texture2D(u_map, gl_PointCoord);
    if (texel.a < 0.04) discard;
    gl_FragColor = vec4(v_color, texel.a * v_alpha);
  }
`;

type Props = {
  url: string;
  target: React.MutableRefObject<GliderTarget>;
  mode: VisualMode;
};

function dotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,.75)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function getMeshes(scene: THREE.Object3D) {
  const meshes: THREE.Mesh[] = [];
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) meshes.push(mesh);
  });
  return meshes;
}

function triangles(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const index = geometry.index;
  const result: Array<[number, number, number]> = [];
  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      result.push([index.getX(i), index.getX(i + 1), index.getX(i + 2)]);
    }
  } else {
    for (let i = 0; i < position.count; i += 3) result.push([i, i + 1, i + 2]);
  }
  return result;
}

function areaData(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const faces = triangles(geometry);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  let area = 0;
  for (const [i0, i1, i2] of faces) {
    a.fromBufferAttribute(position, i0);
    b.fromBufferAttribute(position, i1);
    c.fromBufferAttribute(position, i2);
    area += new THREE.Triangle(a, b, c).getArea();
  }
  return { faces, area };
}

function sample(geometry: THREE.BufferGeometry, amount: number, output: Float32Array, offset: number) {
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const { faces, area } = areaData(geometry);
  if (!faces.length || area <= 0) return offset;
  const cumulative = new Float32Array(faces.length);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  let total = 0;
  for (let i = 0; i < faces.length; i += 1) {
    const [i0, i1, i2] = faces[i];
    a.fromBufferAttribute(position, i0);
    b.fromBufferAttribute(position, i1);
    c.fromBufferAttribute(position, i2);
    total += new THREE.Triangle(a, b, c).getArea();
    cumulative[i] = total;
  }
  for (let p = 0; p < amount; p += 1) {
    const pick = Math.random() * area;
    let low = 0;
    let high = faces.length - 1;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (cumulative[middle] < pick) low = middle + 1;
      else high = middle;
    }
    const [i0, i1, i2] = faces[low];
    a.fromBufferAttribute(position, i0);
    b.fromBufferAttribute(position, i1);
    c.fromBufferAttribute(position, i2);
    const root = Math.sqrt(Math.random());
    const s = Math.random();
    const u = 1 - root;
    const v = root * (1 - s);
    const w = root * s;
    const index = (offset + p) * 3;
    output[index] = a.x * u + b.x * v + c.x * w;
    output[index + 1] = a.y * u + b.y * v + c.y * w;
    output[index + 2] = a.z * u + b.z * v + c.z * w;
  }
  return offset + amount;
}

function colors(positions: Float32Array) {
  const output = new Float32Array(positions.length);
  const top = new THREE.Color("#ffffff");
  const blue = new THREE.Color("#7DA7D9");
  const mid = new THREE.Color("#6484B5");
  for (let i = 0; i < positions.length; i += 3) {
    const color = top.clone().lerp(blue, THREE.MathUtils.clamp((positions[i + 1] + 0.25) / 0.75, 0, 1));
    if (Math.random() < 0.15) color.lerp(mid, 0.7);
    output[i] = color.r;
    output[i + 1] = color.g;
    output[i + 2] = color.b;
  }
  return output;
}

function GliderRig({ url, target, mode }: Props) {
  const { scene } = useGLTF(url);
  const root = useRef<THREE.Group>(null);
  const orientation = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const solids = useRef<THREE.Group>(null);
  const current = useRef({ ...target.current });
  const currentQuaternion = useRef(new THREE.Quaternion());
  const targetQuaternion = useRef(new THREE.Quaternion());
  const headingQuaternion = useRef(new THREE.Quaternion());
  const bankQuaternion = useRef(new THREE.Quaternion());
  const forwardAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const flightDirection = useMemo(() => new THREE.Vector3(), []);
  const pointer = useRef(new THREE.Vector2(10, 10));
  const texture = useMemo(() => dotTexture(), []);
  const meshes = useMemo(() => getMeshes(scene), [scene]);
  const normalization = useMemo(() => {
    const matrix = normalizingMatrix(scene);
    const decomposed = decomposeMatrix(matrix);
    return { ...decomposed, rotation: new THREE.Euler().setFromQuaternion(decomposed.quaternion), matrix };
  }, [scene]);

  const geometry = useMemo(() => {
    if (!meshes.length) return null;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const particleCount = isDesktop ? 40000 : PARTICLE_COUNT;
    const positions = new Float32Array(particleCount * 3);
    const data = meshes.map((mesh) => ({ geometry: mesh.geometry, area: areaData(mesh.geometry).area }));
    const totalArea = data.reduce((sum, item) => sum + item.area, 0);
    let offset = 0;
    data.forEach((item, index) => {
      const amount = index === data.length - 1
        ? particleCount - offset
        : Math.max(1, Math.round((item.area / totalArea) * particleCount));
      offset = sample(item.geometry, amount, positions, offset);
    });
    const vector = new THREE.Vector3();
    for (let i = 0; i < particleCount; i += 1) {
      vector.fromArray(positions, i * 3).applyMatrix4(normalization.matrix).toArray(positions, i * 3);
    }
    const targets = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.62 + (i % 17) * 0.006;
      targets[i * 3] = Math.cos(angle) * radius;
      targets[i * 3 + 1] = Math.sin(angle) * radius * 0.42;
      targets[i * 3 + 2] = Math.sin(angle * 3) * 0.035;
      sizes[i] = isDesktop ? 0.045 + Math.random() * 0.03 : 0.04 + Math.random() * 0.025;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("color", new THREE.BufferAttribute(colors(positions), 3));
    result.setAttribute("a_target", new THREE.BufferAttribute(targets, 3));
    result.setAttribute("a_size", new THREE.BufferAttribute(sizes, 1));
    return result;
  }, [meshes, normalization]);

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_transition: { value: 0 },
    u_mouse: { value: new THREE.Vector3(10, 10, 10) },
    u_map: { value: texture },
  }), [texture]);

  useEffect(() => {
    const update = (x: number, y: number) => pointer.current.set((x / window.innerWidth) * 2 - 1, 1 - (y / window.innerHeight) * 2);
    const move = (event: MouseEvent) => update(event.clientX, event.clientY);
    const touch = (event: TouchEvent) => { const item = event.touches[0]; if (item) update(item.clientX, item.clientY); };
    const clear = () => pointer.current.set(10, 10);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("touchstart", touch, { passive: true });
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("touchend", clear, { passive: true });
    window.addEventListener("touchcancel", clear, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchstart", touch);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("touchend", clear);
      window.removeEventListener("touchcancel", clear);
    };
  }, []);

  useEffect(() => () => { texture.dispose(); geometry?.dispose(); }, [texture, geometry]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = target.current;
    const active = current.current;
    const damp = (value: number, destination: number) => THREE.MathUtils.damp(value, destination, 5, dt);
    active.x = damp(active.x, next.x);
    active.y = damp(active.y, next.y);
    active.scale = damp(active.scale, next.scale);
    active.rotX = damp(active.rotX, next.rotX);
    active.rotY = damp(active.rotY, next.rotY);
    active.rotZ = damp(active.rotZ, next.rotZ);

    if (root.current) {
      root.current.position.set(active.x, active.y, 0);
      root.current.scale.setScalar(active.scale);
    }
    if (orientation.current) {
      // The sampled model's nose is local +Y. Align that axis directly to the
      // screen-space travel tangent, then bank around the nose so the wings
      // keep a visible 3D angle without ever inverting the aircraft.
      flightDirection.set(Math.cos(active.rotZ + Math.PI / 2), Math.sin(active.rotZ + Math.PI / 2), 0).normalize();
      headingQuaternion.current.setFromUnitVectors(forwardAxis, flightDirection);
      // The source mesh is authored inverted around its forward axis; this
      // half-turn puts the tail fin above the fuselage, with a slight bank.
      bankQuaternion.current.setFromAxisAngle(forwardAxis, Math.PI + 0.24);
      targetQuaternion.current.copy(headingQuaternion.current).multiply(bankQuaternion.current);
      currentQuaternion.current.slerp(targetQuaternion.current, 1 - Math.exp(-9 * dt));
      orientation.current.quaternion.copy(currentQuaternion.current);
    }

    uniforms.u_time.value = state.clock.elapsedTime;
    uniforms.u_transition.value = THREE.MathUtils.damp(uniforms.u_transition.value, mode === "particles" ? 0 : 1, 3, dt);
    const mouseX = reduced ? 10 : pointer.current.x;
    const mouseY = reduced ? 10 : pointer.current.y;
    uniforms.u_mouse.value.x = THREE.MathUtils.damp(uniforms.u_mouse.value.x, mouseX, 8, dt);
    uniforms.u_mouse.value.y = THREE.MathUtils.damp(uniforms.u_mouse.value.y, mouseY, 8, dt);
    uniforms.u_mouse.value.z = 0;

    if (points.current) {
      const material = points.current.material as THREE.ShaderMaterial;
      material.opacity = THREE.MathUtils.damp(material.opacity ?? 0.95, mode === "particles" && !reduced ? 0.95 : 0, 6, dt);
    }
    if (solids.current) solids.current.children.forEach((child) => {
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.opacity = THREE.MathUtils.damp(material.opacity, mode === "solid" ? 1 : 0.03, 6, dt);
    });
  });

  return (
    <group ref={root}>
      <group ref={orientation}>
        {geometry && (
          <points ref={points} geometry={geometry} frustumCulled={false}>
            <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </points>
        )}
        <group position={normalization.position} rotation={normalization.rotation} scale={normalization.scale}>
          <group ref={solids}>
            {meshes.map((mesh, index) => (
              <mesh key={index} geometry={mesh.geometry}>
                <meshStandardMaterial color="#d7e0f0" metalness={0.85} roughness={0.25} emissive="#1e3a8a" emissiveIntensity={0.2} transparent opacity={0.03} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

export default function GliderParticles({ url = LOCAL_GLIDER_URL, target, mode }: { url?: string; target: React.RefObject<GliderTarget>; mode: VisualMode }) {
  return <><GliderRig url={url} target={target as React.MutableRefObject<GliderTarget>} mode={mode} /><Preload all /></>;
}

export { GliderRig };
