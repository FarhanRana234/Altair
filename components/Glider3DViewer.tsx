"use client";

import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box } from "lucide-react";

const MODEL_URL = "/models/glider.glb";
useGLTF.preload(MODEL_URL);

type ViewerMode = "render" | "cad";

function renderMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#dbe4f2",
    metalness: 0.85,
    roughness: 0.25,
    emissive: "#0a3a5c",
    emissiveIntensity: 0.25,
  });
}

function cadMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#aee6ff",
    metalness: 0.15,
    roughness: 0.4,
    emissive: "#00f0ff",
    emissiveIntensity: 0.55,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });
}

function GLTFModel({ mode }: { mode: ViewerMode }) {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = mode === "cad" ? cadMaterial() : renderMaterial();
      }
    });
  }, [scene, mode]);

  return <primitive object={scene} scale={1.1} />;
}

export default function Glider3DViewer() {
  const [mode, setMode] = useState<ViewerMode>("render");

  return (
    <div className="relative h-full w-full">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [4, 2.2, 6], fov: 42, near: 0.1, far: 50 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 6]} intensity={1.2} />
        <directionalLight position={[-5, -3, 3]} intensity={0.35} color="#3b82f6" />
        <pointLight position={[3, 2, 4]} intensity={25} color="#00f0ff" />
        <Suspense fallback={null}>
          <GLTFModel mode={mode} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.1}
          minDistance={3.5}
          maxDistance={12}
        />
      </Canvas>

      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-accent-blue/25 bg-space-deep/70 p-1.5 backdrop-blur-md">
        <button
          onClick={() => setMode("render")}
          aria-label="Rendered view"
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-sans text-[10px] font-medium uppercase tracking-widest transition-all ${
            mode === "render"
              ? "bg-accent-cyan/20 text-accent-cyan shadow-[0_0_16px_rgba(0,240,255,0.35)]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Render
        </button>
        <button
          onClick={() => setMode("cad")}
          aria-label="CAD wireframe view"
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-sans text-[10px] font-medium uppercase tracking-widest transition-all ${
            mode === "cad"
              ? "bg-accent-cyan/20 text-accent-cyan shadow-[0_0_16px_rgba(0,240,255,0.35)]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Box className="h-3 w-3" />
          CAD
        </button>
      </div>
    </div>
  );
}