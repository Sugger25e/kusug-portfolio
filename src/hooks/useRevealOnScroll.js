import { useEffect } from 'react';

export default function useRevealOnScroll(deps = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('show'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const ratio = entry.intersectionRatio || 0;
          if (!entry.isIntersecting) return;

          if (ratio > 0.02 && ratio < 0.35 && !el.classList.contains('show')) {
            el.classList.add('peek');
          }

          if (ratio >= 0.35) {
            el.classList.remove('peek');
            el.classList.add('show');
            io.unobserve(el);
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: [0, 0.02, 0.08, 0.18, 0.35, 0.6, 1],
      }
    );

    els.forEach((el, idx) => {
      if (el.classList.contains('show')) return;
      el.style.setProperty('--d', `${Math.min(idx * 0.06, 0.5)}s`);
      io.observe(el);
    });

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
