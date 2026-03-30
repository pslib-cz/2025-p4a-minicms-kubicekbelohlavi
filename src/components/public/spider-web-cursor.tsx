"use client";

import { useEffect, useRef } from "react";

interface Cobweb {
  x: number;
  y: number;
  angle: number;
  createdAt: number;
  opacity: number;
  radius: number;
}

interface WebShot {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  startedAt: number;
  duration: number;
}

const SPEED_THRESHOLD = 1800;
const COBWEB_LIFETIME = 5000;
const COBWEB_FADE = 1500;
const SHOT_DURATION = 120;
const COBWEB_RADIUS = 110;
const COOLDOWN = 400;

function rayToBorder(
  px: number,
  py: number,
  dx: number,
  dy: number,
  w: number,
  h: number,
): { x: number; y: number } {
  let tMin = Infinity;

  if (dx > 0) {
    const t = (w - px) / dx;
    if (t > 0 && t < tMin) tMin = t;
  } else if (dx < 0) {
    const t = -px / dx;
    if (t > 0 && t < tMin) tMin = t;
  }

  if (dy > 0) {
    const t = (h - py) / dy;
    if (t > 0 && t < tMin) tMin = t;
  } else if (dy < 0) {
    const t = -py / dy;
    if (t > 0 && t < tMin) tMin = t;
  }

  if (!isFinite(tMin)) return { x: px, y: py };

  return {
    x: Math.max(0, Math.min(w, px + dx * tMin)),
    y: Math.max(0, Math.min(h, py + dy * tMin)),
  };
}

function drawCobweb(
  ctx: CanvasRenderingContext2D,
  web: Cobweb,
  dpr: number,
) {
  const { x, y, angle, opacity, radius } = web;
  if (opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x * dpr, y * dpr);

  const r = radius * dpr;
  const spokes = 9;
  const rings = 5;

  // Draw spokes radiating from center
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 1.2 * dpr;
  for (let i = 0; i < spokes; i++) {
    const a = angle + (Math.PI * i) / spokes - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }

  // Draw connecting arcs between spokes
  ctx.lineWidth = 0.8 * dpr;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  for (let ring = 1; ring <= rings; ring++) {
    const ringR = (r * ring) / rings;
    ctx.beginPath();
    for (let i = 0; i <= spokes; i++) {
      const a = angle + (Math.PI * i) / spokes - Math.PI / 2;
      // Add slight sag for organic look
      const sag = ring % 2 === 0 ? 0.92 : 1.06;
      const px = Math.cos(a) * ringR * sag;
      const py = Math.sin(a) * ringR * sag;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  ctx.restore();
}

function drawShot(
  ctx: CanvasRenderingContext2D,
  shot: WebShot,
  dpr: number,
) {
  const { fromX, fromY, toX, toY, progress } = shot;
  const currentX = fromX + (toX - fromX) * progress;
  const currentY = fromY + (toY - fromY) * progress;

  ctx.save();

  // Main web line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 1.5 * dpr;
  ctx.beginPath();
  ctx.moveTo(fromX * dpr, fromY * dpr);
  ctx.lineTo(currentX * dpr, currentY * dpr);
  ctx.stroke();

  // Secondary thinner lines for organic look
  const offsets = [-3, 3];
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 0.7 * dpr;
  for (const off of offsets) {
    const angle = Math.atan2(toY - fromY, toX - fromX) + Math.PI / 2;
    const ox = Math.cos(angle) * off;
    const oy = Math.sin(angle) * off;
    ctx.beginPath();
    ctx.moveTo((fromX + ox) * dpr, (fromY + oy) * dpr);
    ctx.lineTo((currentX + ox * 0.3) * dpr, (currentY + oy * 0.3) * dpr);
    ctx.stroke();
  }

  ctx.restore();
}

export function SpiderWebCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    cobwebs: [] as Cobweb[],
    shots: [] as WebShot[],
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    lastShotTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
    resize();
    window.addEventListener("resize", resize);

    const state = stateRef.current;

    function onMouseMove(e: MouseEvent) {
      const now = performance.now();
      const dt = now - state.lastTime;

      if (state.lastTime > 0 && dt > 0 && dt < 200) {
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = (dist / dt) * 1000;

        if (speed > SPEED_THRESHOLD && now - state.lastShotTime > COOLDOWN) {
          state.lastShotTime = now;

          const w = window.innerWidth;
          const h = window.innerHeight;
          const border = rayToBorder(e.clientX, e.clientY, dx, dy, w, h);

          state.shots.push({
            fromX: e.clientX,
            fromY: e.clientY,
            toX: border.x,
            toY: border.y,
            progress: 0,
            startedAt: now,
            duration: SHOT_DURATION,
          });

          // Schedule cobweb creation at the border point
          const angle = Math.atan2(dy, dx);
          setTimeout(() => {
            state.cobwebs.push({
              x: border.x,
              y: border.y,
              angle,
              createdAt: performance.now(),
              opacity: 1,
              radius: COBWEB_RADIUS + Math.random() * 40,
            });
          }, SHOT_DURATION);
        }
      }

      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.lastTime = now;
    }

    window.addEventListener("mousemove", onMouseMove);

    let rafId: number;

    function animate() {
      if (!canvas || !ctx) return;
      const now = performance.now();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw shots
      state.shots = state.shots.filter((shot) => {
        const elapsed = now - shot.startedAt;
        shot.progress = Math.min(1, elapsed / shot.duration);
        drawShot(ctx, shot, dpr);
        return shot.progress < 1;
      });

      // Update and draw cobwebs
      state.cobwebs = state.cobwebs.filter((web) => {
        const age = now - web.createdAt;
        if (age > COBWEB_LIFETIME + COBWEB_FADE) return false;

        if (age > COBWEB_LIFETIME) {
          web.opacity = 1 - (age - COBWEB_LIFETIME) / COBWEB_FADE;
        }

        drawCobweb(ctx, web, dpr);
        return true;
      });

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
