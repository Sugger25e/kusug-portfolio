import React, { useEffect, useRef, useState } from 'react';
import { clients } from './Testimonials';
const API_BASE = 'https://kusug-portfolio-backend.vercel.app';
//const API_BASE = 'http://localhost:5173'

function useCountUp(target, duration = 1200, startOnVisibleRef) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!Number.isFinite(target) || target <= 0) {
      setValue(0);
      return;
    }

    const start = () => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startRef.current) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.floor(target * eased));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (startOnVisibleRef?.current) {
      const el = startOnVisibleRef.current;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) start();
        });
      }, { threshold: 0.3 });
      io.observe(el);
      return () => io.disconnect();
    } else {
      start();
    }
  }, [target, duration, startOnVisibleRef]);

  return value;
}

function StatCard({ label, value, loading }) {
  return (
    <div className="stat-card reveal" style={{ '--d': '0.05s' }}>
      <div className="stat-value">{loading ? '…' : value.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

const Stats = ({ modId }) => {
  const [downloads, setDownloads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serverMsg, setServerMsg] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        let dl = 0;
  const url = `${API_BASE}/api/curseforge/${modId}`;
        try {
          const r1 = await fetch(url);
          if (r1.ok) {
            const ct = (r1.headers.get('content-type') || '').toLowerCase();
            if (ct.includes('application/json')) {
              const j = await r1.json();
              dl = Number(j.downloadCount || 0);
            } else {
              const txt = await r1.text();
              setServerMsg(txt);
              dl = 0;
            }
          }
        } catch {}
        if (!dl) {
          try {
            const r2 = await fetch(url);
            if (r2.ok) {
              const ct2 = (r2.headers.get('content-type') || '').toLowerCase();
              if (ct2.includes('application/json')) {
                const j2 = await r2.json();
                dl = Number(j2.downloadCount || 0);
              } else {
                const txt2 = await r2.text();
                setServerMsg(txt2);
                dl = 0;
              }
            }
          } catch {}
        }
        if (!cancelled) setDownloads(dl || 0);
      } catch (e) {
        if (!cancelled) setDownloads(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (modId) run();
    return () => { cancelled = true; };
  }, [modId]);

  const animatedDownloads = useCountUp(downloads, 1200, wrapperRef);

  const projectsMade = Array.isArray(clients) ? clients.length : 0;
  const animatedProjects = useCountUp(projectsMade, 900, wrapperRef);

  return (
    <section id="stats" className="section stats" ref={wrapperRef}>
      <div className="container">
        <h2>Live Stats</h2>
        <div className="stats-grid">
          <StatCard label="Projects made" value={animatedProjects} loading={false} />
          <StatCard label="Total downloads" value={animatedDownloads} loading={loading} />
        </div>
    {serverMsg ? (
          <p className="muted" style={{ marginTop: 8 }}>Server: {serverMsg}</p>
    ) : (animatedDownloads === 0) && (
          <p className="muted" style={{ marginTop: 8 }}>
      If downloads show 0, ensure your backend is running and .env has REACT_APP_STATS_API (and REACT_APP_CF_MOD_ID), then restart the dev server.
          </p>
        )}
      </div>
    </section>
  );
};

export default Stats;
