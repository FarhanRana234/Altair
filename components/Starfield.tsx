"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  phase: number;
  speed: number;
};

const COLORS = [
  "rgba(255, 255, 255, 0.9)",
  "rgba(170, 205, 246, 0.72)",
  "rgba(125, 167, 217, 0.58)",
  "rgba(100, 132, 181, 0.42)",
];

function getStarCount(width: number, height: number) {
  const area = width * height;
  return Math.round(Math.min(3600, Math.max(700, area / 5000)));
}

function buildStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    r: Math.random() * 1.45 + 0.35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.6 + 0.35,
  }));
}

export default function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = buildStars(getStarCount(width, height), width, height);
    let scrollY = window.scrollY;
    let raf = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = buildStars(getStarCount(width, height), width, height);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const tick = (now: number) => {
      const time = now / 1000;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < -8) star.x = width + 8;
        if (star.x > width + 8) star.x = -8;
        if (star.y < -8) star.y = height + 8;
        if (star.y > height + 8) star.y = -8;

        const parallaxY = ((scrollY * 0.018 * (star.r / 1.8)) % (height + 16)) - 8;
        const y = (star.y - parallaxY + height + 8) % (height + 16) - 8;
        const pulse = 0.38 + 0.62 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase));
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 ${className ?? ""}`}
    />
  );
}
