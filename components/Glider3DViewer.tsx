"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box } from "lucide-react";
import ModelErrorBoundary from "./ModelErrorBoundary";
import {
  LOCAL_GLIDER_URL,
  FALLBACK_GLIDER_URL,
  normalizingMatrix,
  decomposeMatrix,
} from "../lib/gltf";

useGLTF.preload(LOCAL_GLIDER_URL);

type ViewerMode = "render" | "cad";

function renderMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#dbe4f2",
    metalness: 0.85,
    roughness: 0.25,
    emissive: "#446391",
    emissiveIntensity: 0.2,
  });
}

function cadMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#7DA7D9",
    metalness: 0.15,
    roughness: 0.4,
    emissive: "#7DA7D9",
    emissiveIntensity: 0.55,
    wireframe: true,
    transparent: true,
    opacity: 0.65,
  });
}

function GLTFModel({ url, mode }: { url: string; mode: ViewerMode }) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const clone = scene.clone() as THREE.Object3D;
    const matrix = normalizingMatrix(scene);
    const { position, quaternion, scale } = decomposeMatrix(matrix);
    clone.position.copy(position);
    clone.quaternion.copy(quaternion);
    clone.scale.copy(scale);
    return clone;
  }, [scene]);

  useEffect(() => {
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = mode === "cad" ? cadMaterial() : renderMaterial();
      }
    });
  }, [model, mode]);

  return <primitive object={model} />;
}

export default function Glider3DViewer() {
  const [mode, setMode] = useState<ViewerMode>("render");

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [4, 2.2, 6], fov: 42, near: 0.1, far: 50 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-5, -3, 3]} intensity={0.35} color="#446391" />
        <pointLight position={[3, 2, 4]} intensity={25} color="#7DA7D9" />
        <Suspense fallback={null}>
          <ModelErrorBoundary
            fallback={<GLTFModel url={FALLBACK_GLIDER_URL} mode={mode} />}
          >
            <GLTFModel url={LOCAL_GLIDER_URL} mode={mode} />
          </ModelErrorBoundary>
        </Suspense>
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.1}
          minDistance={3.5}
          maxDistance={12}
        />
      </Canvas>

      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-[#446391]/35 bg-[#071834]/85 p-1.5 backdrop-blur-md">
        <button
          onClick={() => setMode("render")}
          aria-label="Rendered view"
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] font-normal uppercase tracking-widest transition-all ${
            mode === "render"
              ? "bg-[#7DA7D9]/20 text-[#7DA7D9] shadow-[0_0_16px_rgba(125,167,217,0.35)]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Render
        </button>
        <button
          onClick={() => setMode("cad")}
          aria-label="CAD wireframe view"
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] font-normal uppercase tracking-widest transition-all ${
            mode === "cad"
              ? "bg-[#7DA7D9]/20 text-[#7DA7D9] shadow-[0_0_16px_rgba(125,167,217,0.35)]"
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