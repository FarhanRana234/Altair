"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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

function FallbackGlider({ mode }: { mode: ViewerMode }) {
  const geometry = useMemo(() => {
    const TX = (x: number, y: number, z: number) =>
      new THREE.Matrix4().makeTranslation(x, y, z);
    const RX = (a: number) => new THREE.Matrix4().makeRotationX(a);
    const RZ = (a: number) => new THREE.Matrix4().makeRotationZ(a);
    const SC = (x: number, y: number, z: number) =>
      new THREE.Matrix4().makeScale(x, y, z);
    const compose = (...mats: THREE.Matrix4[]) =>
      mats.reduce((acc, m) => acc.multiply(m), new THREE.Matrix4());

    const parts: THREE.BufferGeometry[] = [];
    const push = (geo: THREE.BufferGeometry, mat: THREE.Matrix4) => {
      geo.applyMatrix4(mat);
      parts.push(geo);
    };

    push(new THREE.CylinderGeometry(0.1, 0.24, 3.6, 28, 1, false), compose(TX(0, 0, 0), RX(Math.PI / 2)));
    push(new THREE.ConeGeometry(0.1, 1.2, 28), compose(TX(0, 0, 1.8), RX(Math.PI / 2)));
    const canopy = new THREE.SphereGeometry(0.22, 24, 16);
    push(canopy, compose(TX(0, 0.16, 0.75), SC(1, 0.72, 1.9)));
    push(new THREE.BoxGeometry(1.75, 0.032, 1.6), compose(TX(-0.86, -0.08, -0.05), RZ(0.16), RX(-0.5)));
    push(new THREE.BoxGeometry(1.75, 0.032, 1.6), compose(TX(0.86, -0.08, -0.05), RZ(-0.16), RX(-0.5)));
    push(new THREE.BoxGeometry(0.03, 0.34, 0.22), compose(TX(-1.72, 0.05, 0.12), RZ(0.45)));
    push(new THREE.BoxGeometry(0.03, 0.34, 0.22), compose(TX(1.72, 0.05, 0.12), RZ(-0.45)));
    push(new THREE.BoxGeometry(0.72, 0.028, 1.5), compose(TX(0, -0.06, -1.5), RX(-0.5)));
    push(new THREE.BoxGeometry(0.045, 0.62, 0.98), compose(TX(0, 0.3, -1.45), RX(0.12), RZ(0.12)));
    push(new THREE.BoxGeometry(0.09, 0.16, 2.4), compose(TX(0, -0.2, -0.15)));

    const merged = new THREE.BufferGeometry();
    merged.setIndex([]);
    const allPos: number[] = [];
    const allNorm: number[] = [];
    parts.forEach((g) => {
      const pos = g.attributes.position;
      const nrm = g.attributes.normal;
      for (let i = 0; i < pos.count; i += 1) {
        allPos.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        allNorm.push(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
      }
    });
    merged.setAttribute("position", new THREE.Float32BufferAttribute(allPos, 3));
    merged.setAttribute("normal", new THREE.Float32BufferAttribute(allNorm, 3));
    return merged;
  }, []);

  return <mesh geometry={geometry} material={mode === "cad" ? cadMaterial() : renderMaterial()} />;
}

export default function Glider3DViewer() {
  const [hasModel, setHasModel] = useState<boolean | null>(null);
  const [mode, setMode] = useState<ViewerMode>("render");

  useEffect(() => {
    let active = true;
    fetch(MODEL_URL, { method: "HEAD" })
      .then((res) => {
        if (active) setHasModel(res.ok);
      })
      .catch(() => {
        if (active) setHasModel(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
        camera={{ position: [4, 2.2, 6], fov: 42, near: 0.1, far: 50 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 6]} intensity={1.2} />
        <directionalLight position={[-5, -3, 3]} intensity={0.35} color="#3b82f6" />
        <pointLight position={[3, 2, 4]} intensity={25} color="#00f0ff" />
        {hasModel === null ? (
          <FallbackGlider mode={mode} />
        ) : hasModel ? (
          <Suspense fallback={null}>
            <GLTFModel mode={mode} />
          </Suspense>
        ) : (
          <FallbackGlider mode={mode} />
        )}
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