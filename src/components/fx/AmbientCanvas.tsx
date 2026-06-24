"use client";

import { useEffect, useRef } from "react";

/**
 * Animated connected-particles background (premium tech aesthetic).
 * Renders subtle blue nodes + links on a transparent canvas.
 */
export function AmbientCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const canvas: HTMLCanvasElement | null = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cv: HTMLCanvasElement = canvas;
    const cx: CanvasRenderingContext2D = ctx;

    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      running = true;
    let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const lowPower =
      // @ts-ignore
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      window.innerWidth < 720;

    function reset() {
      const parent = cv.parentElement;
      dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.3 : 1.7);
      w = parent ? parent.clientWidth : window.innerWidth;
      h = parent ? parent.clientHeight : window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = lowPower ? 30000 : 21000;
      const count = Math.min(lowPower ? 34 : 70, Math.max(16, Math.floor((w * h) / density)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.5 + 0.5,
      }));
    }

    function tick() {
      if (!running) return;
      cx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i],
            b = pts[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            cx.strokeStyle = `rgba(37,99,235,${(1 - dist / 140) * 0.12})`;
            cx.lineWidth = 1;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, b.y);
            cx.stroke();
          }
        }
      }
      for (const p of pts) {
        cx.fillStyle = "rgba(37,99,235,.5)";
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(reset, 150);
    };
    const onVis = () => {
      running = !document.hidden;
      if (running && !raf) tick();
      if (!running && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    reset();
    tick();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
