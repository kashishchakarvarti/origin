"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const DOTS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 100),
  y: ((i * 53 + 7) % 100),
  size: 2 + (i % 3),
  delay: (i % 20) * 0.1,
}));

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let i = 0; i < h; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }

      // Animated connection arcs
      const hubs = [
        { x: 0.22, y: 0.35 },
        { x: 0.45, y: 0.28 },
        { x: 0.72, y: 0.32 },
        { x: 0.55, y: 0.55 },
        { x: 0.35, y: 0.65 },
        { x: 0.78, y: 0.58 },
      ];

      hubs.forEach((hub, i) => {
        const next = hubs[(i + 1) % hubs.length];
        const progress = (Math.sin(time * 0.002 + i) + 1) / 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.08 + progress * 0.12})`;
        ctx.lineWidth = 1;
        const cx = (hub.x + next.x) / 2 * w;
        const cy = (hub.y + next.y) / 2 * h - 30;
        ctx.moveTo(hub.x * w, hub.y * h);
        ctx.quadraticCurveTo(cx, cy, next.x * w, next.y * h);
        ctx.stroke();
      });

      // Hub dots
      hubs.forEach((hub, i) => {
        const pulse = Math.sin(time * 0.003 + i * 1.5) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(hub.x * w, hub.y * h, 3 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${0.4 + pulse * 0.4})`;
        ctx.fill();
      });

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {DOTS.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-gold/30"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: dot.delay }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50" />
    </div>
  );
}
