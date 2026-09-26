"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Preload } from "@react-three/drei";
import {
  LOCAL_GLIDER_URL,
  normalizingMatrix,
  decomposeMatrix,
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

/**
 * Computes shortest angular distance from a0 to a1 in degrees.
 * Handles wrap-around so 170° -> -170° sweeps 20° through 180° instead of 340° through 0°.
 */
export function shortAngleDist(a0: number, a1: number): number {
  const max = 360;
  const da = (a1 - a0) % max;
  return ((2 * da) % max) - da;
}

/**
 * Normalizes any angle in degrees into [-180, 180].
 * Prevents unbounded growth over long scroll sessions.
 */
export function normalizeAngle(a: number): number {
  let angle = (a + 180) % 360;
  if (angle < 0) angle += 360;
  return angle - 180;
}

useGLTF.preload(LOCAL_GLIDER_URL);

const PARTICLE_COUNT = 4500;

const particleVertexShader = `
  attribute vec3 a_target;
  attribute float a_size;
  uniform float u_time;
  uniform float u_transition;
  uniform vec3 u_mouse;
  varying vec3 v_color;
  varying float v_alpha;

  void main() {
    vec3 base = mix(position, a_target, smoothstep(0.0, 1.0, u_transition));
    vec3 delta = base - u_mouse;
    float distanceToPointer = length(delta);
    float influence = exp(-distanceToPointer * distanceToPointer * 7.0);
    vec3 displaced = base + normalize(delta + vec3(0.0001)) * influence * 0.11;
    displaced += vec3(0.0, sin(u_time * 0.55 + position.x * 8.0) * 0.004, 0.0);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = a_size * (300.0 / max(1.0, -mvPosition.z));
    v_color = color;
    v_alpha = 0.72 + influence * 0.28;
  }
`;

const particleFragmentShader = `
  uniform sampler2D u_map;
  varying vec3 v_color;
  varying float v_alpha;

  void main() {
    vec4 texel = texture2D(u_map, gl_PointCoord);
    if (texel.a < 0.04) discard;
    gl_FragColor = vec4(v_color, texel.a * v_alpha);
  }
`;

type RigProps = {
  url: string;
  target: React.MutableRefObject<GliderTarget>;
  mode: VisualMode;
};

function makeSoftDotTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.75)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function geometryTriangles(
  geometry: THREE.BufferGeometry
): { triangles: Array<[number, number, number]>; totalArea: number } {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const index = geometry.index;
  const triangles: Array<[number, number, number]> = [];

  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      triangles.push([index.getX(i), index.getX(i + 1), index.getX(i + 2)]);
    }
  } else {
    for (let i = 0; i < pos.count; i += 3) {
      triangles.push([i, i + 1, i + 2]);
    }
  }

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  let totalArea = 0;
  for (let t = 0; t < triangles.length; t += 1) {
    const [i0, i1, i2] = triangles[t];
    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    totalArea += ab.cross(ac).length() * 0.5;
  }
  return { triangles, totalArea };
}

function collectAllGeometries(scene: THREE.Object3D): THREE.BufferGeometry[] {
  const all: THREE.BufferGeometry[] = [];
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      all.push(mesh.geometry);
    }
  });
  return all;
}

function sampleForGeometry(
  geometry: THREE.BufferGeometry,
  count: number,
  out: Float32Array,
  offset: number
): number {
  const { triangles, totalArea } = geometryTriangles(geometry);
  if (!triangles.length || totalArea <= 0) return offset;

  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const cum = new Float32Array(triangles.length);
  let running = 0;
  for (let t = 0; t < triangles.length; t += 1) {
    const [i0, i1, i2] = triangles[t];
    const a = new THREE.Vector3().fromBufferAttribute(pos, i0);
    const b = new THREE.Vector3().fromBufferAttribute(pos, i1);
    const c = new THREE.Vector3().fromBufferAttribute(pos, i2);
    running += b.clone().sub(a).cross(c.clone().sub(a)).length() * 0.5;
    cum[t] = running;
  }

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let p = 0; p < count; p += 1) {
    const r = Math.random() * totalArea;
    let lo = 0;
    let hi = triangles.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const [i0, i1, i2] = triangles[lo];
    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);
    const root = Math.sqrt(Math.random());
    const s2 = Math.random();
    const u = 1 - root;
    const v = root * (1 - s2);
    const w = s2 * root;
    out[(offset + p) * 3] = a.x * u + b.x * v + c.x * w;
    out[(offset + p) * 3 + 1] = a.y * u + b.y * v + c.y * w;
    out[(offset + p) * 3 + 2] = a.z * u + b.z * v + c.z * w;
  }
  return offset + count;
}

function makeColors(positions: Float32Array): Float32Array {
  const colors = new Float32Array(positions.length);
  const white = new THREE.Color("#ffffff");
  const lightBlue = new THREE.Color("#7DA7D9");
  const midBlue = new THREE.Color("#6484B5");
  const deepBlue = new THREE.Color("#446391");
  for (let i = 0; i < positions.length / 3; i += 1) {
    const y = positions[i * 3 + 1];
    const t = THREE.MathUtils.clamp((y + 0.25) / 0.75, 0, 1);
    const color = white.clone().lerp(lightBlue, t);
    if (Math.random() < 0.15) color.lerp(midBlue, 0.7);
    if (Math.random() < 0.08) color.lerp(deepBlue, 0.85);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return colors;
}

function GliderRig({ url, target, mode }: RigProps) {
  const { scene } = useGLTF(url);
  const positionGroup = useRef<THREE.Group>(null);
  const rotationGroup = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const solidsRef = useRef<THREE.Group>(null);

  const normalization = useMemo(() => {
    const matrix = normalizingMatrix(scene);
    const { position, quaternion, scale } = decomposeMatrix(matrix);
    return { position, rotation: new THREE.Euler().setFromQuaternion(quaternion), scale, matrix };
  }, [scene]);

  const geometries = useMemo(() => collectAllGeometries(scene), [scene]);

  const pointsGeometry = useMemo(() => {
    if (!geometries.length) return null;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const areas = geometries.map((g) => geometryTriangles(g).totalArea);
    const total = areas.reduce((sum, a) => sum + a, 0);
    let offset = 0;
    if (total > 0) {
      for (let g = 0; g < geometries.length; g += 1) {
        const share = Math.max(1, Math.round((areas[g] / total) * PARTICLE_COUNT));
        offset = sampleForGeometry(geometries[g], share, positions, offset);
      }
    }
    if (offset < PARTICLE_COUNT) {
      sampleForGeometry(geometries[0], PARTICLE_COUNT - offset, positions, offset);
    }

    const v = new THREE.Vector3();
    for (let p = 0; p < PARTICLE_COUNT; p += 1) {
      v.set(positions[p * 3], positions[p * 3 + 1], positions[p * 3 + 2]);
      v.applyMatrix4(normalization.matrix);
      positions[p * 3] = v.x;
      positions[p * 3 + 1] = v.y;
      positions[p * 3 + 2] = v.z;
    }

    const colors = makeColors(positions);
    const targets = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const radius = 0.62 + (i % 17) * 0.006;
      targets[i * 3] = Math.cos(angle) * radius;
      targets[i * 3 + 1] = Math.sin(angle) * radius * 0.42;
      targets[i * 3 + 2] = Math.sin(angle * 3.0) * 0.035;
    }
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) sizes[i] = 0.012 + Math.random() * 0.018;
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    buffer.setAttribute("a_target", new THREE.BufferAttribute(targets, 3));
    buffer.setAttribute("a_size", new THREE.BufferAttribute(sizes, 1));
    return buffer;
  }, [geometries, normalization]);

  const dotTexture = useMemo(() => makeSoftDotTexture(), []);

  useEffect(() => {
    return () => {
      dotTexture.dispose();
      if (pointsGeometry) {
        pointsGeometry.dispose();
      }
    };
  }, [dotTexture, pointsGeometry]);

  const currentPos = useRef<{ x: number; y: number; scale: number }>({
    x: target.current.x,
    y: target.current.y,
    scale: target.current.scale,
  });
  const prevDampedPos = useRef<{ x: number; y: number }>({
    x: target.current.x,
    y: target.current.y,
  });

  // Initial heading points along initial path vector towards the right-bottom (~27.7 deg)
  const targetAngle = useRef<number>(27.7);
  const currentAngle = useRef<number>(27.7);
  const prevAngle = useRef<number>(27.7);
  const bankAngle = useRef<number>(0);
  const currentRotation = useRef({ rotX: target.current.rotX, rotY: target.current.rotY, rotZ: target.current.rotZ });
  const currentPointerX = useRef(0);
  const shaderUniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_transition: { value: 0 },
    u_mouse: { value: new THREE.Vector3(10, 10, 10) },
    u_map: { value: dotTexture },
  }), [dotTexture]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    const c = currentPos.current;
    const tgt = target.current;

    // Respect prefers-reduced-motion: show a static, correctly-oriented pose
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (positionGroup.current) {
        positionGroup.current.position.set(tgt.x, tgt.y, 0);
        positionGroup.current.scale.setScalar(tgt.scale);
      }
      if (rotationGroup.current) {
        const rad = (27.7 * Math.PI) / 180;
        const f = new THREE.Vector3(Math.cos(rad), -Math.sin(rad), 0).normalize();
        const zWorld = f.clone().negate();
        const desiredUp = new THREE.Vector3(0, 0.22, 0.97).normalize();
        const r = new THREE.Vector3().crossVectors(desiredUp, zWorld).normalize();
        const u = new THREE.Vector3().crossVectors(zWorld, r).normalize();
        const m = new THREE.Matrix4().makeBasis(r, u, zWorld);
        rotationGroup.current.quaternion.setFromRotationMatrix(m);
      }
      if (pointsRef.current) {
        const mat = pointsRef.current.material as THREE.PointsMaterial;
        mat.opacity = mode === "particles" ? 0.95 : 0;
      }
      if (solidsRef.current) {
        solidsRef.current.children.forEach((child) => {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) mat.opacity = mode === "solid" ? 1 : 0.03;
        });
      }
      return;
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    shaderUniforms.u_time.value = t;
    shaderUniforms.u_transition.value = THREE.MathUtils.damp(
      shaderUniforms.u_transition.value,
      mode === "particles" ? 0 : 1,
      2.8,
      dt,
    );
    shaderUniforms.u_mouse.value.x = THREE.MathUtils.damp(shaderUniforms.u_mouse.value.x, state.pointer.x * 0.85, 4.5, dt);
    shaderUniforms.u_mouse.value.y = THREE.MathUtils.damp(shaderUniforms.u_mouse.value.y, state.pointer.y * 0.58, 4.5, dt);
    shaderUniforms.u_mouse.value.z = THREE.MathUtils.damp(shaderUniforms.u_mouse.value.z, 0, 4.5, dt);

    // Smoothly and slowly damp position towards scroll target
    c.x = THREE.MathUtils.damp(c.x, tgt.x, 3.5, dt);
    c.y = THREE.MathUtils.damp(c.y, tgt.y, 3.5, dt);
      c.scale = THREE.MathUtils.damp(c.scale, tgt.scale, 3.5, dt);
    currentRotation.current.rotX = THREE.MathUtils.damp(currentRotation.current.rotX, tgt.rotX, 3.5, dt);
    currentRotation.current.rotY = THREE.MathUtils.damp(currentRotation.current.rotY, tgt.rotY, 3.5, dt);
    currentRotation.current.rotZ = THREE.MathUtils.damp(currentRotation.current.rotZ, tgt.rotZ, 3.5, dt);

    // Parallax pointer sway
    currentPointerX.current = THREE.MathUtils.damp(
      currentPointerX.current,
      state.pointer.x * 0.25 * (isMobile ? 0.4 : 1),
      3,
      dt
    );

    // 1. Compute real per-frame movement vector in screen coordinates (down = positive Y)
    const screenDx = c.x - prevDampedPos.current.x;
    const screenDy = -(c.y - prevDampedPos.current.y);

    prevDampedPos.current.x = c.x;
    prevDampedPos.current.y = c.y;

    const speed = Math.hypot(screenDx, screenDy);

    // Base offset: 0 because nose lines up with angle 0 (towards right) in screen coordinates
    const baseOffset = 0;

    if (speed > 0.0003) {
      const angleDeg = Math.atan2(screenDy, screenDx) * (180 / Math.PI) + baseOffset;
      targetAngle.current = normalizeAngle(angleDeg);
    }

    // 3. Interpolate angles by shortest path smoothly
    const turnResponse = speed > 0.008 ? 8 : 4.5;
    const lerpFactor = Math.min(1, dt * turnResponse);
    const nextAngle =
      currentAngle.current + shortAngleDist(currentAngle.current, targetAngle.current) * lerpFactor;

    // 4. Normalize every stored/output angle into [-180, 180] after each update
    currentAngle.current = normalizeAngle(nextAngle);

    // Subtle natural banking into turns
    const da = shortAngleDist(prevAngle.current, currentAngle.current);
    prevAngle.current = currentAngle.current;
    const targetBank = THREE.MathUtils.clamp(-da * 0.07, -0.28, 0.28);
    bankAngle.current = THREE.MathUtils.damp(bankAngle.current, targetBank, 5, dt);

    // 5. Apply position on positionGroup and rotation on rotationGroup separately
    if (positionGroup.current) {
      const float = Math.sin(t * 0.8) * 0.035;
      positionGroup.current.position.set(c.x + currentPointerX.current, c.y + float, 0);
      positionGroup.current.scale.setScalar(c.scale);
    }

    if (rotationGroup.current) {
      const rad = (currentAngle.current * Math.PI) / 180;
      // Nose heading in Three.js world coordinates (Z = 0 plane)
      const fx = Math.cos(rad);
      const fy = -Math.sin(rad); // screen down is Three.js negative Y
      const f = new THREE.Vector3(fx, fy, 0).normalize();

      // In glider.glb, Nose is -Z, Tail is +Z, Right Wing is +X, Canopy is +Y.
      // Therefore, to point the nose in direction f, the local +Z axis must point in -f:
      const zWorld = f.clone().negate();

      // Desired up vector: tilted slightly towards camera (+Z) and world up (+Y)
      // This ensures the top canopy/wings are always gracefully visible from the camera
      const desiredUp = new THREE.Vector3(0, 0.22, 0.97).normalize();

      // Right wing vector (local +X)
      const r = new THREE.Vector3().crossVectors(desiredUp, zWorld).normalize();

      // Apply banking around the forward flight axis
      if (Math.abs(bankAngle.current) > 0.001) {
        r.applyAxisAngle(f, bankAngle.current);
      }

      // Orthogonal up vector (local +Y canopy axis)
      const u = new THREE.Vector3().crossVectors(zWorld, r).normalize();

      // Construct orthonormal basis: Column 0 = r (+X), Column 1 = u (+Y), Column 2 = zWorld (+Z)
      const m = new THREE.Matrix4().makeBasis(r, u, zWorld);
      rotationGroup.current.quaternion.setFromRotationMatrix(m);
      rotationGroup.current.rotateX(currentRotation.current.rotX);
      rotationGroup.current.rotateY(currentRotation.current.rotY);
      rotationGroup.current.rotateZ(currentRotation.current.rotZ);
    }

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, mode === "particles" ? 0.95 : 0, 6, dt);
    }

    if (solidsRef.current) {
      solidsRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.opacity = THREE.MathUtils.damp(mat.opacity, mode === "solid" ? 1 : 0.03, 6, dt);
        }
      });
    }
  });

  return (
    <group ref={positionGroup}>
      <group rotation={[0.18, -0.1, 0.16]}>
        <group ref={rotationGroup}>
        {pointsGeometry ? (
          <points ref={pointsRef} geometry={pointsGeometry} frustumCulled={false}>
            <shaderMaterial
              uniforms={shaderUniforms}
              vertexShader={particleVertexShader}
              fragmentShader={particleFragmentShader}
              vertexColors
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        ) : null}
        <group position={normalization.position} rotation={normalization.rotation} scale={normalization.scale}>
          <group ref={solidsRef}>
            {geometries.map((geometry, i) => (
              <mesh key={i} geometry={geometry}>
                <meshStandardMaterial
                  color="#d7e0f0"
                  metalness={0.85}
                  roughness={0.25}
                  emissive="#1e3a8a"
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.03}
                />
              </mesh>
            ))}
          </group>
        </group>
        </group>
      </group>
    </group>
  );
}

export default function GliderParticles({
  url = LOCAL_GLIDER_URL,
  target,
  mode,
}: {
  url?: string;
  target: React.RefObject<GliderTarget>;
  mode: VisualMode;
}) {
  return (
    <>
      <GliderRig url={url} target={target as React.MutableRefObject<GliderTarget>} mode={mode} />
      <Preload all />
    </>
  );
}
