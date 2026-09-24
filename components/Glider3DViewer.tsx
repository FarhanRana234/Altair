"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import { Box, Boxes, ScanLine } from "lucide-react";

export type GliderMode = "cad" | "render";

function CadMaterial() {
  return (
    <meshStandardMaterial
      color="#0a3d62"
      emissive="#00f0ff"
      emissiveIntensity={0.28}
      wireframe
      transparent
      opacity={0.85}
    />
  );
}

function RenderMaterial() {
  return (
    <meshStandardMaterial
      color="#cbd5e1"
      metalness={0.92}
      roughness={0.28}
      emissive="#1e3a8a"
      emissiveIntensity={0.12}
    />
  );
}

function ProceduralGlider({ mode }: { mode: GliderMode }) {
  const body = mode === "cad" ? <CadMaterial /> : <RenderMaterial />;
  const canopy =
    mode === "cad" ? (
      <meshStandardMaterial
        color="#0a3d62"
        emissive="#00f0ff"
        emissiveIntensity={0.3}
        wireframe
        transparent
        opacity={0.8}
      />
    ) : (
      <meshStandardMaterial
        color="#7defff"
        metalness={0.4}
        roughness={0.15}
        transparent
        opacity={0.9}
      />
    );

  return (
    <group rotation={[0.35, -0.4, 0.1]} scale={1}>
      <group>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.17, 5.4, 20, 1, false]} />
          {body}
        </mesh>

        <mesh position={[0, 2.95, 0]}>
          <coneGeometry args={[0.09, 0.85, 20]} />
          {body}
        </mesh>

        <mesh position={[0, 1.55, 0.24]} scale={[1, 0.75, 1.7]}>
          <sphereGeometry args={[0.13, 16, 12]} />
          {canopy}
        </mesh>

        <mesh position={[-1.45, -0.25, 0]} rotation={[0.16, 0, 0.16]}>
          <boxGeometry args={[2.9, 0.035, 1.05]} />
          {body}
        </mesh>

        <mesh position={[1.45, -0.25, 0]} rotation={[-0.16, 0, -0.16]}>
          <boxGeometry args={[2.9, 0.035, 1.05]} />
          {body}
        </mesh>

        <mesh position={[-0.82, -1.9, 0]}>
          <boxGeometry args={[1.6, 0.03, 0.55]} />
          {body}
        </mesh>

        <mesh position={[0.82, -1.9, 0]}>
          <boxGeometry args={[1.6, 0.03, 0.55]} />
          {body}
        </mesh>

        <mesh position={[0, -1.85, 0.32]}>
          <boxGeometry args={[0.05, 0.95, 1.05]} />
          {body}
        </mesh>

        <mesh position={[0, -0.05, 0]} scale={[0.55, 0.55, 0.55]}>
          <sphereGeometry args={[0.16, 14, 12]} />
          {body}
        </mesh>
      </group>
    </group>
  );
}

function GLTFModel({ mode }: { mode: GliderMode }) {
  const { scene } = useGLTF("/models/glider.gltf");
  const body = mode === "cad" ? <CadMaterial /> : <RenderMaterial />;

  return (
    <group>
      {scene.children.map((child, index) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return <group key={index} />;
        return (
          <mesh key={index} geometry={mesh.geometry}>
            {body}
          </mesh>
        );
      })}
    </group>
  );
}

function Model({ mode }: { mode: GliderMode }) {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/models/glider.gltf", { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (available === null) return <ProceduralGlider mode={mode} />;
  return available ? (
    <Suspense fallback={<ProceduralGlider mode={mode} />}>
      <GLTFModel mode={mode} />
    </Suspense>
  ) : (
    <ProceduralGlider mode={mode} />
  );
}

export default function Glider3DViewer() {
  const [mode, setMode] = useState<GliderMode>("render");

  const buttonBase =
    "flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-xs font-medium tracking-widest uppercase transition-all";

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-accent-blue/25 bg-gradient-to-b from-space/60 to-space-deep backdrop-blur-md sm:h-[480px]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [6.5, 4, 6.5], fov: 40, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 8, 4]} intensity={1.4} />
        <directionalLight position={[-5, -2, -6]} intensity={0.35} color="#3b82f6" />
        <pointLight position={[4, 2, 4]} intensity={25} color="#00f0ff" />
        <Suspense fallback={null}>
          <Model mode={mode} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.6}
          minDistance={4}
          maxDistance={14}
          target={[0, 0.2, 0]}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
        <div className="pointer-events-auto inline-flex rounded-full border border-accent-blue/25 bg-space-deep/70 p-1 backdrop-blur-sm">
          <button
            onClick={() => setMode("cad")}
            className={`${buttonBase} ${
              mode === "cad"
                ? "border-accent-cyan/60 bg-accent-cyan/15 text-accent-cyan"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Boxes className="h-3.5 w-3.5" />
            CAD Blueprint
          </button>
          <button
            onClick={() => setMode("render")}
            className={`${buttonBase} ${
              mode === "render"
                ? "border-accent-cyan/60 bg-accent-cyan/15 text-accent-cyan"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ScanLine className="h-3.5 w-3.5" />
            Rendered
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-accent-blue/25 bg-space-deep/70 px-4 py-2 backdrop-blur-sm">
          <Box className="h-3.5 w-3.5 text-accent-cyan" />
          <span className="font-sans text-[11px] font-light uppercase tracking-widest text-slate-300">
            First prototype
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <span className="rounded-full border border-accent-blue/20 bg-space-deep/60 px-4 py-1.5 font-sans text-[10px] font-light uppercase tracking-widest2 text-slate-400 backdrop-blur-sm">
          drag to orbit · scroll to zoom
        </span>
      </div>
    </div>
  );
}