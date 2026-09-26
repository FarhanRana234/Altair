"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GliderParticles, {
  type GliderTarget,
} from "./GliderParticles";
import CanvasErrorBoundary from "./CanvasErrorBoundary";
import ModelErrorBoundary from "./ModelErrorBoundary";
import { LOCAL_GLIDER_URL, FALLBACK_GLIDER_URL } from "../lib/gltf";

gsap.registerPlugin(ScrollTrigger);

export type RelativeWaypoint = {
  xPct: number;
  yPct: number;
  scale: number;
  duration: number;
};

// Flight-path waypoints defined in normalized viewport percentages (% of visible half-width/height)
// 1. Starts left top (Hero header area)
// 2. Glides across to right bottom (AeroPakistan / Team Altair)
// 3. Sweeps across to left bottom (Meet The Team / Project)
// 4. Settles gently at centre bottom (Sponsorship / Footer) slowly
export const FLIGHT_WAYPOINTS: RelativeWaypoint[] = [
  // 1. Start at Left Top (Hero screen)
  { xPct: -0.62, yPct: 0.76, scale: 1.0, duration: 0 },
  // 2. Smooth glide to Right Bottom
  { xPct: 0.58, yPct: 0.14, scale: 0.96, duration: 0.36 },
  // 3. Sweep across to Left Bottom
  { xPct: -0.55, yPct: -0.46, scale: 0.92, duration: 0.36 },
  // 4. Descend into Centre Bottom slowly
  { xPct: 0.0, yPct: -0.80, scale: 0.88, duration: 0.28 },
];

export function getViewportBounds() {
  if (typeof window === "undefined") {
    return { halfW: 4.5, halfH: 2.7, isMobile: false, isLandscape: false };
  }
  const fov = 42;
  const cameraZ = 7;
  const halfH = Math.tan((fov / 2) * (Math.PI / 180)) * cameraZ;
  const width = window.innerWidth;
  const height = window.innerHeight || 1;
  const aspect = width / height;
  const halfW = halfH * aspect;
  const isMobile = width < 768;
  const isLandscape = width > height && isMobile;
  return { halfW, halfH, isMobile, isLandscape };
}

export function computeWaypointPos(
  wp: RelativeWaypoint,
  bounds: ReturnType<typeof getViewportBounds>
) {
  const marginX = bounds.isMobile ? (bounds.isLandscape ? 0.35 : 0.45) : 0.4;
  const marginY = 0.45;
  const safeHalfW = Math.max(0.6, bounds.halfW - marginX);
  const safeHalfH = Math.max(0.6, bounds.halfH - marginY);

  // Scaled down significantly on PC (~52% of before) and mobile (~36% of before)
  // so the glider is sleek, delicate, and never obstructs the content
  const deviceScale = bounds.isMobile
    ? bounds.isLandscape
      ? 0.42
      : 0.36
    : 0.52;

  return {
    x: wp.xPct * safeHalfW,
    y: wp.yPct * safeHalfH,
    scale: wp.scale * deviceScale,
  };
}

export default function HeroCanvas() {
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const target = useRef<GliderTarget>({
    x: -1.6,
    y: 1.4,
    scale: 0.52,
  });

  useEffect(() => {
    function checkSupport(): boolean {
      if (typeof window === "undefined") return false;
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl");
        if (!gl) return false;
        const ctx = gl as WebGLRenderingContext;
        if (typeof ctx.isContextLost === "function" && ctx.isContextLost()) {
          return false;
        }
        const loseExt = ctx.getExtension("WEBGL_lose_context");
        if (loseExt) {
          loseExt.loseContext();
        }
        return true;
      } catch {
        return false;
      }
    }

    if (!checkSupport()) {
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    // Respect prefers-reduced-motion: show a static, correctly-oriented pose instead of animating
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      const bounds = getViewportBounds();
      const staticPos = computeWaypointPos(FLIGHT_WAYPOINTS[0], bounds);
      target.current.x = staticPos.x;
      target.current.y = staticPos.y;
      target.current.scale = staticPos.scale;
      return;
    }

    let tl: gsap.core.Timeline | null = null;

    const buildTimeline = () => {
      if (tl) {
        tl.kill();
        tl = null;
      }

      const bounds = getViewportBounds();
      const p0 = computeWaypointPos(FLIGHT_WAYPOINTS[0], bounds);

      if (window.scrollY === 0) {
        target.current.x = p0.x;
        target.current.y = p0.y;
        target.current.scale = p0.scale;
      }

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      for (let i = 1; i < FLIGHT_WAYPOINTS.length; i++) {
        const p = computeWaypointPos(FLIGHT_WAYPOINTS[i], bounds);
        tl.to(target.current, {
          x: p.x,
          y: p.y,
          scale: p.scale,
          duration: FLIGHT_WAYPOINTS[i].duration,
        });
      }

      ScrollTrigger.refresh();
    };

    buildTimeline();

    const handleResize = () => {
      buildTimeline();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (tl) tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!webGLSupported) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[6] will-change-transform">
      <CanvasErrorBoundary fallback={null}>
        <Canvas
          frameloop="always"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 50 }}
          onCreated={({ gl }) => {
            const handleContextLost = (e: Event) => {
              // Crucial: preventDefault allows WebGL context restoration instead of permanent block
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
              fallback={
                <GliderParticles url={FALLBACK_GLIDER_URL} target={target} mode="particles" />
              }
            >
              <GliderParticles url={LOCAL_GLIDER_URL} target={target} mode="particles" />
            </ModelErrorBoundary>
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}