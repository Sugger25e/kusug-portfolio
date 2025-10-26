export function scrollToSection(id, { offset = 0, block = 'start' } = {}) {
  try {
    const el = document.getElementById(id);
    if (!el) return false;

    // If offset is provided (e.g., fixed header), use manual scroll; otherwise, use scrollIntoView
    if (offset && Number.isFinite(offset) && offset !== 0) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } else if (typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block });
    } else {
      // Fallback
      const top = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo(0, top);
    }
    return true;
  } catch {
    return false;
  }
}
