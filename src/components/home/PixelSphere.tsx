"use client";

import { useEffect, useRef } from "react";

/**
 * PixelSphere — a rotating point-cloud sphere on a 2D canvas. Every point
 * reacts to the pointer: nearby points are pushed outward and brighten, then
 * ease back. Monochrome, performant (no WebGL). Interactive on hover.
 */
export default function PixelSphere({
  count = 900,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Fibonacci sphere points.
    const pts = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * 2.399963229728653;
      return {
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        push: 0, // current outward displacement (from cursor)
      };
    });

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      radius = Math.min(w, h) * 0.4;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mx = -9999;
    let my = -9999;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let rot = 0;
    let raf = 0;
    const render = () => {
      rot += reduced ? 0 : 0.0026;
      ctx.clearRect(0, 0, w, h);
      const sin = Math.sin(rot);
      const cos = Math.cos(rot);

      for (const p of pts) {
        // Rotate around Y.
        const x = p.x * cos - p.z * sin;
        const z = p.x * sin + p.z * cos;
        const y = p.y;

        const scale = radius * (1 + p.push);
        let sx = cx + x * scale;
        let sy = cy + y * scale;

        // Cursor repulsion.
        const dx = sx - mx;
        const dy = sy - my;
        const dist = Math.hypot(dx, dy);
        const near = Math.max(0, 1 - dist / 120);
        p.push += (near * 0.25 - p.push) * 0.12;

        // Re-apply push after easing for smoothness.
        const s2 = radius * (1 + p.push);
        sx = cx + x * s2;
        sy = cy + y * s2;

        const depth = (z + 1) / 2; // 0 back → 1 front
        const size = 0.6 + depth * 1.8 + near * 1.6;
        const alpha = 0.15 + depth * 0.55 + near * 0.4;
        ctx.fillStyle = `rgba(${230},${230},${234},${Math.min(1, alpha)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      aria-hidden="true"
    />
  );
}
