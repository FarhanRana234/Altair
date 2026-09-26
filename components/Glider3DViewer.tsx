"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box, Layers } from "lucide-react";
import CanvasErrorBoundary from "./CanvasErrorBoundary";
import ModelErrorBoundary from "./ModelErrorBoundary";
import {
  LOCAL_GLIDER_URL,
  FALLBACK_GLIDER_URL,
  normalizingMatrix,
  decomposeMatrix,
} from "../lib/gltf";

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

function GliderSchematicFallback({ mode }: { mode: ViewerMode }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Background blueprint grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #446391 1px, transparent 1px), linear-gradient(to bottom, #446391 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Crosshairs & technical markings */}
      <div className="pointer-events-none absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-[#7DA7D9]/60">
        REF: AERO-PK // CAD-SPEC 04
      </div>
      <div className="pointer-events-none absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest text-[#7DA7D9]/60">
        SCALE: 1:1 · HIGH-ASPECT RATIO
      </div>

      {/* Technical Glider SVG Wireframe / Silhouette */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        <svg
          viewBox="0 0 400 240"
          className="h-44 w-auto max-w-full drop-shadow-[0_0_24px_rgba(125,167,217,0.25)] sm:h-56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Coordinate Guide axes */}
          <line
            x1="200"
            y1="20"
            x2="200"
            y2="220"
            stroke="#446391"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <line
            x1="30"
            y1="110"
            x2="370"
            y2="110"
            stroke="#446391"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />

          {mode === "cad" ? (
            /* CAD Wireframe Mode */
            <g stroke="#7DA7D9" strokeWidth="1.2" strokeLinejoin="round" fill="none">
              {/* High aspect ratio wing top & ribs */}
              <polygon points="40,110 200,98 360,110 354,124 200,116 46,124" />
              {/* Rib lines */}
              <line x1="80" y1="107" x2="84" y2="122" strokeDasharray="1 1" />
              <line x1="120" y1="104" x2="124" y2="120" strokeDasharray="1 1" />
              <line x1="160" y1="101" x2="162" y2="118" strokeDasharray="1 1" />
              <line x1="240" y1="101" x2="238" y2="118" strokeDasharray="1 1" />
              <line x1="280" y1="104" x2="276" y2="120" strokeDasharray="1 1" />
              <line x1="320" y1="107" x2="316" y2="122" strokeDasharray="1 1" />
              {/* Fuselage centerline boom */}
              <polygon points="196,40 204,40 203,205 197,205" fill="#446391" fillOpacity="0.25" />
              {/* Nose cone */}
              <polygon points="196,40 200,24 204,40" fill="#7DA7D9" fillOpacity="0.3" />
              {/* Horizontal stabilizer */}
              <polygon points="152,192 200,188 248,192 245,200 200,197 155,200" />
              {/* Vertical fin profile */}
              <polygon points="200,165 200,205 204,204 202,165" />
            </g>
          ) : (
            /* Solid Render Mode */
            <g>
              {/* Main wing */}
              <polygon
                points="40,110 200,98 360,110 354,124 200,116 46,124"
                fill="url(#glider-grad)"
                stroke="#7DA7D9"
                strokeWidth="1.2"
              />
              {/* Fuselage */}
              <polygon
                points="196,40 200,24 204,40 203,205 197,205"
                fill="#dbe4f2"
                stroke="#1E3A60"
                strokeWidth="1"
              />
              {/* Tail fin & stabilizer */}
              <polygon
                points="152,192 200,188 248,192 245,200 200,197 155,200"
                fill="#94b8e3"
                stroke="#1E3A60"
                strokeWidth="1"
              />
              <line x1="200" y1="165" x2="200" y2="205" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>
          )}

          <defs>
            <linearGradient id="glider-grad" x1="40" y1="110" x2="360" y2="110" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7DA7D9" />
              <stop offset="0.5" stopColor="#dbe4f2" />
              <stop offset="1" stopColor="#7DA7D9" />
            </linearGradient>
          </defs>
        </svg>

        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] tracking-wider text-[#7DA7D9]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7DA7D9] animate-pulse" />
          {mode === "cad" ? "AEROFOIL WIREFRAME MESH" : "AEROFOIL SURFACE COMPOSITE"}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-[#7DA7D9]/60">
        COMPOSITE BALSA &amp; CARBON-SPAR
      </div>
    </div>
  );
}

export default function Glider3DViewer() {
  const [mode, setMode] = useState<ViewerMode>("render");
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  useEffect(() => {
    function testWebGL(): boolean {
      if (typeof window === "undefined") return false;
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        return !!gl;
      } catch {
        return false;
      }
    }
    if (!testWebGL()) {
      setWebGLSupported(false);
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      {webGLSupported ? (
        <CanvasErrorBoundary fallback={<GliderSchematicFallback mode={mode} />}>
          <Canvas
            frameloop="always"
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "default",
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={[1, 1.5]}
            camera={{ position: [4, 2.2, 6], fov: 42, near: 0.1, far: 50 }}
            onCreated={({ gl }) => {
              const handleContextLost = (e: Event) => {
                e.preventDefault();
              };
              gl.domElement.addEventListener("webglcontextlost", handleContextLost, false);
            }}
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
        </CanvasErrorBoundary>
      ) : (
        <GliderSchematicFallback mode={mode} />
      )}

      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-[#446391]/35 bg-[#071834]/85 p-1.5 backdrop-blur-md z-10">
        <button
          onClick={() => setMode("render")}
          aria-label="Rendered view"
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] font-normal uppercase tracking-widest transition-all ${
            mode === "render"
              ? "bg-[#7DA7D9]/20 text-[#7DA7D9] shadow-[0_0_16px_rgba(125,167,217,0.35)]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="h-3 w-3" />
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
