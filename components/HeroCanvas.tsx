"use client";

import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Boxes, Sparkles } from "lucide-react";
import GliderParticles, {
  type GliderTarget,
  type VisualMode,
} from "./GliderParticles";
import ModelErrorBoundary from "./ModelErrorBoundary";
import { LOCAL_GLIDER_URL, FALLBACK_GLIDER_URL } from "../lib/gltf";

gsap.registerPlugin(ScrollTrigger);

const PATH_START = {
  x: -3.6,
  y: 2.1,
  rotX: -0.65,
  rotY: 0.75,
  rotZ: 0.2,
  scale: 0.95,
};

export default function HeroCanvas() {
  const [mode, setMode] = useState<VisualMode>("particles");
  const target = useRef<GliderTarget>(PATH_START);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // Scroll 1: rotate to face right, glide straight to the right side.
      tl.to(target.current, {
        x: 4,
        y: 2.0,
        rotX: -0.1,
        rotY: 1.45,
        rotZ: 0.1,
        duration: 0.3,
      })
        // Scroll 2: bank left and drop toward bottom-center / bottom-left.
        .to(target.current, {
          x: 0.6,
          y: -0.8,
          rotX: 0.25,
          rotY: 0.5,
          rotZ: -1.05,
          duration: 0.25,
        })
        // Scroll 3: level out, wings level, nose up/forward at bottom-center.
        .to(target.current, {
          x: 0.1,
          y: -1.7,
          rotX: -0.3,
          rotY: -0.1,
          rotZ: 0,
          duration: 0.25,
        })
        // Final scroll: slight diagonal facing top-right, pinned lower-center.
        .to(target.current, {
          x: 0.5,
          y: -1.75,
          rotX: -0.35,
          rotY: 0.45,
          rotZ: 0.18,
          scale: 0.8,
          duration: 0.2,
        });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[6]">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 50 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-5, -3, 3]} intensity={0.35} color="#3b82f6" />
        <pointLight position={[3, 2, 4]} intensity={30} color="#00f0ff" />
        <Suspense fallback={null}>
          <ModelErrorBoundary
            fallback={
              <GliderParticles url={FALLBACK_GLIDER_URL} target={target} mode={mode} />
            }
          >
            <GliderParticles url={LOCAL_GLIDER_URL} target={target} mode={mode} />
          </ModelErrorBoundary>
        </Suspense>
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