import React, { useEffect, useRef, useState, useMemo } from 'react';
const API_BASE = 'https://kusug-portfolio-backend.vercel.app';

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

const Stats = ({ modIds, modId }) => {
  const ids = useMemo(() => {
    const list = (Array.isArray(modIds) && modIds.length ? modIds : (modId ? [modId] : []))
      .filter((v) => v !== undefined && v !== null && `${v}`.trim() !== '')
      .map((v) => `${v}`.trim());
    return Array.from(new Set(list));
  }, [modIds, modId]);

  const [downloads, setDownloads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serverMsg, setServerMsg] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDownloadCount(id) {
      const url = `${API_BASE}/api/curseforge/${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${id}`);
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.includes('application/json')) {
        const j = await res.json();
        return Number(j.downloadCount || 0);
      } else {
        const txt = await res.text();
        throw new Error(txt || `Non-JSON response for ${id}`);
      }
    }

    async function run() {
      if (!ids.length) {
        if (!cancelled) {
          setDownloads(0);
          setLoading(false);
          setServerMsg('');
        }
        return;
      }

      try {
        setLoading(true);
        setServerMsg('');

        const results = await Promise.allSettled(ids.map(fetchDownloadCount));
        let total = 0;
        let firstErr = '';

        results.forEach((r) => {
          if (r.status === 'fulfilled') {
            total += Number(r.value || 0);
          } else if (!firstErr) {
            firstErr = r.reason?.message || String(r.reason || '');
          }
        });

        if (!cancelled) {
          setDownloads(total);
          if (firstErr) setServerMsg(firstErr);
        }
      } catch (e) {
        if (!cancelled) {
          setDownloads(0);
          setServerMsg(e?.message || 'Failed to fetch downloads.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [ids]);

  const animatedDownloads = useCountUp(downloads, 1200, wrapperRef);
  const projectsMade = ids.length;
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
        ) : (animatedDownloads === 0 && !loading) && (
          <p className="muted" style={{ marginTop: 8 }}>
            If downloads show 0, ensure your backend is running and .env has REACT_APP_STATS_API (and IDs), then restart the dev server.
          </p>
        )}
      </div>
    </section>
  );
};

export default Stats;
