import { useEffect } from 'react';

export default function usePreventBodySelectOnDrag() {
  useEffect(() => {
    let dragging = false;

    const isTextual = (el) => {
      if (!el || el === document.body || el === document.documentElement) return false;
      if (el.closest('input, textarea, [contenteditable="true"]')) return true;
      const tag = el.tagName;
      if (tag && /(P|SPAN|A|STRONG|EM|H[1-6]|LI|CODE|PRE|LABEL)/.test(tag)) return true;
      const cs = window.getComputedStyle(el);
      return cs.userSelect === 'text';
    };

    const onDown = (e) => {
      if (e.button !== 0) return; 
      if (isTextual(e.target)) return;
      dragging = true;
      document.body.classList.add('no-select-drag');
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove('no-select-drag');
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', endDrag, { passive: true });
    window.addEventListener('blur', endDrag);
    window.addEventListener('mouseleave', endDrag);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('blur', endDrag);
      window.removeEventListener('mouseleave', endDrag);
    };
  }, []);
}
