"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
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
  rotX: number;
  rotY: number;
  rotZ: number;
  duration: number;
};

// Flight-path waypoints defined in normalized viewport percentages (% of visible half-width/height)
// 1. Starts left top (Hero header area)
// 2. Glides across to right bottom (AeroPakistan / Team Altair)
// 3. Sweeps across to left bottom (Meet The Team / Project)
// 4. Settles gently at centre bottom (Sponsorship / Footer) slowly
export const FLIGHT_WAYPOINTS: RelativeWaypoint[] = [
  // 1. Start at Left Top (Hero screen)
  { xPct: -0.62, yPct: 0.76, scale: 1.0, rotX: 0.08, rotY: -0.08, rotZ: -0.12, duration: 0 },
  // 2. Sweep right while banking into the first curve
  { xPct: 0.58, yPct: 0.14, scale: 0.96, rotX: -0.04, rotY: 0.12, rotZ: 0.2, duration: 0.36 },
  // 3. Cross left in an S-curve
  { xPct: -0.55, yPct: -0.46, scale: 0.92, rotX: 0.1, rotY: -0.16, rotZ: -0.24, duration: 0.36 },
  // 4. Pitch down into the apply/footer area
  { xPct: 0.0, yPct: -0.80, scale: 0.88, rotX: -0.28, rotY: 0.18, rotZ: 0.12, duration: 0.28 },
];

export function getViewportBounds() {
  if (typeof window === "undefined") {
    return { halfW: 4.5, halfH: 2.7, isMobile: false, isLandscape: false };
  }
  const fov = 38;
  const cameraZ = 10;
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
  ): GliderTarget {
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
    rotX: wp.rotX,
    rotY: wp.rotY,
    rotZ: wp.rotZ,
  };
}

export default function HeroCanvas() {
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const target = useRef<GliderTarget>({
    x: -1.6,
    y: 1.4,
    scale: 0.52,
    rotX: 0.08,
    rotY: -0.08,
    rotZ: -0.12,
  });

  useEffect(() => {
    function checkSupport(): boolean {
      if (typeof window === "undefined") return false;
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl2") ||
          canvas.getContext("webgl");
        return !!gl;
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
      target.current.rotX = FLIGHT_WAYPOINTS[0].rotX;
      target.current.rotY = FLIGHT_WAYPOINTS[0].rotY;
      target.current.rotZ = FLIGHT_WAYPOINTS[0].rotZ;
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    const progress = { value: 0 };
    const curve = new THREE.CatmullRomCurve3([]);

    const updateFlightPath = () => {
      const bounds = getViewportBounds();
      const points = FLIGHT_WAYPOINTS.map((waypoint) => {
        const position = computeWaypointPos(waypoint, bounds);
        return new THREE.Vector3(position.x, position.y, 0);
      });
      curve.points = points;

      const t = THREE.MathUtils.clamp(progress.value, 0, 1);
      const position = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const tangentAngle = Math.atan2(-tangent.y, tangent.x);
      const nextT = Math.min(1, t + 0.025);
      const nextTangent = curve.getTangentAt(nextT).normalize();
      const curvature = THREE.MathUtils.clamp(
        (Math.atan2(-nextTangent.y, nextTangent.x) - tangentAngle) * 2.4,
        -0.32,
        0.32,
      );
      const scale = THREE.MathUtils.lerp(0.95, 0.82, t);

      target.current.x = position.x;
      target.current.y = position.y;
      target.current.scale = scale * (bounds.isMobile ? 0.36 : 0.52);
      target.current.rotX = THREE.MathUtils.lerp(0.16, -0.22, t);
      target.current.rotY = THREE.MathUtils.clamp(curvature * 0.35, -0.14, 0.14);
      target.current.rotZ = curvature;
    };

    const buildTimeline = () => {
      tl?.kill();
      updateFlightPath();
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });
      tl.to(progress, { value: 1, duration: 1, onUpdate: updateFlightPath });
      ScrollTrigger.refresh();
    };

    buildTimeline();
    const handleResize = () => buildTimeline();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      tl?.kill();
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
          camera={{ position: [0, 0, 10], fov: 38, near: 0.01, far: 100 }}
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
