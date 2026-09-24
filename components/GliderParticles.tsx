"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Preload } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { useTransform } from "framer-motion";

export type VisualMode = "particles" | "solid";

const MODEL_URL = "/models/glider.glb";

useGLTF.preload(MODEL_URL);

// Whole-page scroll trajectory (progress 0 = hero top, 1 = footer bottom).
// 0% -> 50%:  pinned TOP-LEFT (X: -2.5...-1.5, Y: 2.0), gentle drift/floating in place
// 50% -> 100%: begins primary descent, sweeping diagonally down toward bottom-center/left,
//              resting level above the footer
const KEYFRAMES = [0, 0.5, 0.65, 0.8, 1];

const POS_X = [-2.2, -1.75, 0.4, -0.6, -1.6];
const POS_Y = [2.0, 2.0, 0.6, -1.2, -1.7];
const ROT_X = [0.35, 0.4, 0.3, 0.15, 0.06];
const ROT_Y = [0.6, 0.55, 0.2, -0.15, -0.3];
const ROT_Z = [0.15, 0.2, 1.1, 0.45, 0.12];
const SCALE = [1.0, 1.05, 1.18, 1.0, 0.85];

const PARTICLE_COUNT = 4500;

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

function collectGeometryArea(
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

function sampleForGeometry(
  geometry: THREE.BufferGeometry,
  count: number,
  out: Float32Array,
  offset: number
): number {
  const { triangles, totalArea } = collectGeometryArea(geometry);
  if (!triangles.length || totalArea <= 0) return offset;

  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const cum = new Float32Array(triangles.length);
  let running = 0;
  for (let t = 0; t < triangles.length; t += 1) {
    const [i0, i1, i2] = triangles[t];
    const a = new THREE.Vector3().fromBufferAttribute(pos, i0);
    const b = new THREE.Vector3().fromBufferAttribute(pos, i1);
    const c = new THREE.Vector3().fromBufferAttribute(pos, i2);
    const ab = b.clone().sub(a);
    const ac = c.clone().sub(a);
    running += ab.cross(ac).length() * 0.5;
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
  const cyan = new THREE.Color("#00f0ff");
  const indigo = new THREE.Color("#3b82f6");
  for (let i = 0; i < positions.length / 3; i += 1) {
    const y = positions[i * 3 + 1];
    const t = THREE.MathUtils.clamp((y + 0.25) / 0.75, 0, 1);
    const color = white.clone().lerp(cyan, t);
    if (Math.random() < 0.12) color.lerp(indigo, 0.85);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return colors;
}

function GliderRig({ progress, mode }: { progress: MotionValue<number>; mode: VisualMode }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const solidsRef = useRef<THREE.Group>(null);

  const geometries = useMemo<THREE.BufferGeometry[]>(() => {
    const all: THREE.BufferGeometry[] = [];
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        all.push(mesh.geometry);
      }
    });
    return all;
  }, [scene]);

  const pointsGeometry = useMemo(() => {
    if (!geometries.length) return null;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const areas = geometries.map((g) => collectGeometryArea(g).totalArea);
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
    const colors = makeColors(positions);
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, [geometries]);

  const dotTexture = useMemo(() => makeSoftDotTexture(), []);

  const rotX = useTransform(progress, KEYFRAMES, ROT_X);
  const rotY = useTransform(progress, KEYFRAMES, ROT_Y);
  const rotZ = useTransform(progress, KEYFRAMES, ROT_Z);
  const posX = useTransform(progress, KEYFRAMES, POS_X);
  const posY = useTransform(progress, KEYFRAMES, POS_Y);
  const scale = useTransform(progress, KEYFRAMES, SCALE);

  const current = useRef({
    rotX: ROT_X[0],
    rotY: ROT_Y[0],
    rotZ: ROT_Z[0],
    posX: POS_X[0],
    posY: POS_Y[0],
    scale: SCALE[0],
    pointerX: 0,
    oPts: 1,
    oSolid: 0,
  });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(delta, 0.1);
    const c = current.current;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const xFactor = isMobile ? 0.55 : 1;
    const scaleFactor = isMobile ? 0.55 : 1;
    const halfW = state.viewport.width / 2 - 0.3;

    c.rotX = THREE.MathUtils.damp(c.rotX, rotX.get(), 4, k);
    c.rotY = THREE.MathUtils.damp(c.rotY, rotY.get(), 4, k);
    c.rotZ = THREE.MathUtils.damp(c.rotZ, rotZ.get(), 4, k);
    c.posX = THREE.MathUtils.damp(c.posX, posX.get(), 4, k);
    c.posY = THREE.MathUtils.damp(c.posY, posY.get(), 4, k);
    c.scale = THREE.MathUtils.damp(c.scale, scale.get(), 4, k);
    c.pointerX = THREE.MathUtils.damp(
      c.pointerX,
      state.pointer.x * 0.35 * (isMobile ? 0.6 : 1),
      3,
      k
    );

    if (group.current) {
      group.current.rotation.set(
        c.rotX,
        c.rotY + c.pointerX * 0.12 + Math.sin(t * 0.5) * 0.04,
        c.rotZ
      );
      const float = Math.sin(t * 0.8) * 0.05;
      const baseX = (c.posX + c.pointerX) * xFactor;
      const clampedX = THREE.MathUtils.clamp(baseX, -halfW, halfW);
      group.current.position.set(clampedX, c.posY + float, 0);
      group.current.scale.setScalar(c.scale * scaleFactor);
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.015;
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, mode === "particles" ? 0.95 : 0, 6, k);
    }

    if (solidsRef.current) {
      solidsRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.opacity = THREE.MathUtils.damp(mat.opacity, mode === "solid" ? 1 : 0.03, 6, k);
        }
      });
    }
  });

  return (
    <group ref={group}>
      {pointsGeometry ? (
        <points ref={pointsRef} geometry={pointsGeometry} frustumCulled={false}>
          <pointsMaterial
            map={dotTexture}
            vertexColors
            size={0.035}
            sizeAttenuation
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ) : null}
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
  );
}

export default function GliderParticles({
  progress,
  mode,
}: {
  progress: MotionValue<number>;
  mode: VisualMode;
}) {
  return (
    <>
      <GliderRig progress={progress} mode={mode} />
      <Preload all />
    </>
  );
}