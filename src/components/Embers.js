import React, { useEffect, useRef, useState } from 'react';

export default function Embers() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const runningRef = useRef(true);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (m.matches) { setSupported(false); return; }
    const stopOnChange = () => { if (m.matches) setSupported(false); };
    m.addEventListener?.('change', stopOnChange);
    return () => m.removeEventListener?.('change', stopOnChange);
  }, []);

  useEffect(() => {
    if (!supported) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ORANGE = '#ff9900';
    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0, height = 0;
    const particles = [];

    const rand = (min, max) => Math.random() * (max - min) + min;

    const resize = () => {
      const parent = canvas.parentElement || document.body;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(18, Math.min(60, Math.floor((width * height) / 20000)));
      while (particles.length < target) particles.push(makeParticle());
      while (particles.length > target) particles.pop();
    };

    const makeParticle = () => ({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.4, -0.15), 
      r: rand(0.8, 2.2),
      a: rand(0.35, 0.8),
      t: rand(0, Math.PI * 2), 
      wobble: rand(0.002, 0.008),
      life: 0,
      maxLife: rand(4, 9) 
    });

    let last = performance.now();
    const draw = (now) => {
      if (!runningRef.current) return;
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.t += p.wobble;
        p.x += p.vx + Math.sin(p.t) * 0.12;
        p.y += p.vy * (1 + Math.cos(p.t) * 0.06);
        p.life += dt;

        if (p.y < -10 || p.x < -10 || p.x > width + 10 || p.life > p.maxLife) {
          particles[i] = makeParticle();
          particles[i].y = height + rand(0, 20);
        }

        const alpha = Math.max(0, Math.min(1, p.a * (0.6 + 0.4 * Math.sin(p.t * 2))));
        ctx.beginPath();
        ctx.fillStyle = ORANGE;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = ORANGE;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    };

    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          runningRef.current = e.isIntersecting;
          if (runningRef.current && !rafRef.current) {
            last = performance.now();
            rafRef.current = requestAnimationFrame(draw);
          }
        }
      }, { threshold: 0.05 });
      io.observe(canvas);
    }

    const onResize = () => { dpr = Math.min(2, window.devicePixelRatio || 1); resize(); };
    window.addEventListener('resize', onResize);
    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      if (io) io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [supported]);

  if (!supported) return null;
  return <canvas className="embers-canvas" ref={canvasRef} aria-hidden="true" />;
}
