import React, { useEffect, useRef, useState } from 'react';

export default function OverlayScrollbar() {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const hideTimer = useRef(null);
  const dragRef = useRef({ dragging: false, startY: 0, startTop: 0 });
  const rafRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const mqCoarse = window.matchMedia?.('(pointer: coarse)');
    const mqNarrow = window.matchMedia?.('(max-width: 760px)');
    const update = () => setShouldRender(!(mqCoarse?.matches || mqNarrow?.matches));
    update();
    mqCoarse?.addEventListener?.('change', update);
    mqNarrow?.addEventListener?.('change', update);
    return () => {
      mqCoarse?.removeEventListener?.('change', update);
      mqNarrow?.removeEventListener?.('change', update);
    };
  }, []);

  const update = () => {
    const doc = document.documentElement;
    const body = document.body;
    const viewport = window.innerHeight;
  const nav = document.querySelector('.nav');
  const topOffset = (nav?.getBoundingClientRect().height || 0) + 4; 
  const bottomOffset = 12; 
    const docHeight = Math.max(doc.scrollHeight, body.scrollHeight);
    const maxScroll = Math.max(0, docHeight - viewport);
    if (!trackRef.current || !thumbRef.current) return;

    const isScrollable = maxScroll > 0;
    setEnabled(isScrollable);
    if (!isScrollable) return;

  const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
  const thumbH = 35; // px
  const trackH = Math.max(0, viewport - topOffset - bottomOffset);
  const maxThumbTop = Math.max(0, trackH - thumbH);
    const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;

    const el = trackRef.current;
  el.style.setProperty('--os-top', `${topOffset}px`);
  el.style.setProperty('--os-bottom', `${bottomOffset}px`);
    el.style.setProperty('--thumb-h', `${thumbH}px`);
    el.style.setProperty('--thumb-t', `${thumbTop}px`);
  };

  const nudgeVisible = (immediate = false) => {
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), immediate ? 800 : 1200);
  };

  useEffect(() => {
    const schedule = (immediate = false) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = 0;
      });
      nudgeVisible(immediate);
    };
    const onScroll = () => schedule(false);
    const onResize = () => schedule(true);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging || !trackRef.current) return;
  const viewport = window.innerHeight;
      const doc = document.documentElement;
      const body = document.body;
      const docHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const maxScroll = Math.max(0, docHeight - viewport);
      const styles = getComputedStyle(trackRef.current);
  const thumbH = parseFloat(styles.getPropertyValue('--thumb-h')) || 0;
  const trackH = trackRef.current.clientHeight;
  const maxThumbTop = Math.max(0, trackH - thumbH);
      const dy = e.clientY - dragRef.current.startY;
      const newThumbTop = Math.min(maxThumbTop, Math.max(0, dragRef.current.startTop + dy));
      const scrollTop = (newThumbTop / maxThumbTop) * maxScroll;
      window.scrollTo({ top: scrollTop, behavior: 'auto' });
    };
    const onUp = () => { dragRef.current.dragging = false; setActive(false); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const onThumbDown = (e) => {
    if (!trackRef.current) return;
    const styles = getComputedStyle(trackRef.current);
    const top = parseFloat(styles.getPropertyValue('--thumb-t')) || 0;
    dragRef.current = { dragging: true, startY: e.clientY, startTop: top };
    setActive(true);
    const prevSel = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    e.preventDefault();
    const onUp = () => {
      dragRef.current.dragging = false;
      setActive(false);
      document.body.style.userSelect = prevSel;
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mouseup', onUp);
  };


  if (!enabled || !shouldRender) return null;

  return (
    <div className="overlay-scrollbar" aria-hidden="true">
      <div
        ref={trackRef}
        className={`os-track ${visible ? 'visible' : ''} ${active ? 'active' : ''}`}
        onMouseEnter={() => nudgeVisible(true)}
        onMouseMove={() => nudgeVisible(true)}
      >
        <div
          ref={thumbRef}
          className="os-thumb"
          onMouseDown={onThumbDown}
          role="presentation"
        />
      </div>
    </div>
  );
}
