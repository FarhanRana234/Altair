"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { Boxes, Sparkles } from "lucide-react";
import GliderParticles, { type VisualMode } from "./GliderParticles";

export default function HeroCanvas({ progress }: { progress: MotionValue<number> }) {
  const [mode, setMode] = useState<VisualMode>("particles");

  return (
    <div className="pointer-events-none fixed inset-0 z-[6]">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 50 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 6]} intensity={1.1} />
        <directionalLight position={[-5, -3, 3]} intensity={0.35} color="#3b82f6" />
        <pointLight position={[3, 2, 4]} intensity={30} color="#00f0ff" />
        <GliderParticles progress={progress} mode={mode} />
      </Canvas>

      <div className="pointer-events-none absolute right-4 bottom-4 z-20 sm:right-6 sm:bottom-6">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-accent-blue/25 bg-space-deep/70 p-1.5 backdrop-blur-md">
          <button
            onClick={() => setMode("particles")}
            aria-label="Particle cloud view"
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-widest transition-all ${
              mode === "particles"
                ? "bg-accent-cyan/20 text-accent-cyan shadow-[0_0_16px_rgba(0,240,255,0.35)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Particles
          </button>
          <button
            onClick={() => setMode("solid")}
            aria-label="Solid rendered view"
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-widest transition-all ${
              mode === "solid"
                ? "bg-accent-cyan/20 text-accent-cyan shadow-[0_0_16px_rgba(0,240,255,0.35)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Boxes className="h-3.5 w-3.5" />
            Solid
          </button>
        </div>
      </div>
    </div>
  );
}