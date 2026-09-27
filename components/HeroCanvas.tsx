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
  // 1. Start above the hero copy, clear of the heading and CTA
  { xPct: 0.14, yPct: 0.68, scale: 1.0, rotX: 0.08, rotY: -0.08, rotZ: -0.12, duration: 0 },
  // 2. Sweep right while banking into the first curve
  { xPct: 0.58, yPct: 0.14, scale: 0.96, rotX: -0.04, rotY: 0.12, rotZ: 0.2, duration: 0.36 },
  // 3. Cross left in an S-curve
  { xPct: -0.55, yPct: -0.46, scale: 0.92, rotX: 0.1, rotY: -0.16, rotZ: -0.24, duration: 0.36 },
  // 4. Drop straight down through the centre; no sweeping final turn
  { xPct: 0, yPct: -0.72, scale: 1.02, rotX: 0, rotY: 0, rotZ: -Math.PI / 2, duration: 0.28 },
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
    : 0.7;

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

    let flightTrigger: ScrollTrigger | null = null;
    const progress = { value: 0 };
    const curve = new THREE.CatmullRomCurve3([]);
    let previousTangentAngle: number | null = null;

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
      // Use the continuous tangent directly. Flipping the angle by π when the
      // path crosses vertical makes the nose suddenly reverse mid-flight.
      let tangentAngle = Math.atan2(tangent.y, tangent.x);
      if (previousTangentAngle !== null) {
        while (tangentAngle - previousTangentAngle > Math.PI) tangentAngle -= Math.PI * 2;
        while (tangentAngle - previousTangentAngle < -Math.PI) tangentAngle += Math.PI * 2;
      }
      previousTangentAngle = tangentAngle;
      // Once the glider reaches the final section, hold a true vertical dive
      // instead of interpolating through a roll-inducing curved turn.
      if (t > 0.72) tangentAngle = -Math.PI / 2;
      const scale = THREE.MathUtils.lerp(1.08, 0.94, t);

      target.current.x = position.x;
      target.current.y = position.y;
      target.current.scale = scale * (bounds.isMobile ? 0.36 : 0.78);
      // The particle mesh is authored nose-first along local +Z. Keep it
      // face-on to the camera and yaw it in screen space along the flight path.
      target.current.rotX = 0;
      target.current.rotY = 0;
      target.current.rotZ = tangentAngle;

    };

    const buildTimeline = () => {
      flightTrigger?.kill();
      updateFlightPath();
      flightTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Read ScrollTrigger progress directly so reverse scrolling immediately
          // moves the glider back up the path instead of leaving a scrub tween behind.
          progress.value = self.progress;
          updateFlightPath();
        },
      });
      progress.value = flightTrigger.progress;
      updateFlightPath();
      ScrollTrigger.refresh();
    };

    buildTimeline();
    const handleResize = () => buildTimeline();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      flightTrigger?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!webGLSupported) {
    return null;
  }

  return (
    <div
      className="altair-hero-canvas pointer-events-none fixed inset-0 z-0 will-change-transform"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
    >
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
          style={{ width: "100%", height: "100%", display: "block", pointerEvents: "auto" }}
          onCreated={({ gl }) => {
            gl.domElement.style.width = "100vw";
            gl.domElement.style.height = "100vh";
            gl.domElement.style.display = "block";
            gl.setSize(window.innerWidth, window.innerHeight, false);
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
