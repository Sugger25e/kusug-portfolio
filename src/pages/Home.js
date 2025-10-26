import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import Contact from '../components/Contact';
import useRevealOnScroll from '../hooks/useRevealOnScroll';
import OverlayScrollbar from '../components/OverlayScrollbar';
import usePreventBodySelectOnDrag from '../hooks/usePreventBodySelectOnDrag';
import { useEffect, useMemo, useRef, useState } from 'react';
import { scrollToSection } from '../utils/scrollToSection';
import logo from '../assets/logo.png';

function Home() {
    useRevealOnScroll([]);
    usePreventBodySelectOnDrag();
  const [navOpen, setNavOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const navMenuRef = useRef(null);
  const [dotX, setDotX] = useState(null);
  const [dotTargetId, setDotTargetId] = useState(null);
  const dotLockTimerRef = useRef(null);
    const closeNav = () => setNavOpen(false);

    const sectionIds = useMemo(() => ['about', 'works', 'stats', 'testimonials', 'contact'], []);

    useEffect(() => {
      const els = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (!els.length) return;

      const computeActive = () => {
        const viewportMid = window.scrollY + window.innerHeight / 2;
        let best = { id: '', dist: Number.POSITIVE_INFINITY };
        for (const el of els) {
          const rect = el.getBoundingClientRect();
          const elMid = window.scrollY + rect.top + rect.height / 2;
          const dist = Math.abs(elMid - viewportMid);
          if (dist < best.dist) best = { id: el.id, dist };
        }
        if (best.id && best.id !== activeId) setActiveId(best.id);
      };

      // Initialize and attach listeners
      computeActive();
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(computeActive);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }, [sectionIds, activeId]);

    // Update animated dot position under active link on desktop
    useEffect(() => {
      const updateDot = () => {
        const wrap = navMenuRef.current;
        const id = dotTargetId || activeId;
        if (!wrap || !id) return;
        const link = wrap.querySelector(`a[href="#${id}"]`);
        if (!link) return;
        const x = link.offsetLeft + link.offsetWidth / 2;
        setDotX(x);
      };
      updateDot();
      window.addEventListener('resize', updateDot, { passive: true });
      const id = setTimeout(updateDot, 0);
      return () => { window.removeEventListener('resize', updateDot); clearTimeout(id); };
    }, [activeId, navOpen, dotTargetId]);

    return (
    <div className="site">
      <nav className="nav">
        <div className="container nav-inner">
          <a href="/" className="brand" onClick={closeNav} aria-label="KuSug Home">
            <img src={logo} alt="KuSug" className="brand-logo" />
            <span className="brand-text">KuSug</span>
          </a>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={navOpen}
            aria-controls="navMenu"
            onClick={() => setNavOpen(o => !o)}
          >
            <span className="nav-toggle-bar" aria-hidden="true" />
            <span className="nav-toggle-bar" aria-hidden="true" />
            <span className="nav-toggle-bar" aria-hidden="true" />
          </button>
          <div id="navMenu" ref={navMenuRef} className={`nav-links ${navOpen ? 'open' : ''}`}>
            <span
              className="active-dot"
              aria-hidden="true"
              style={{ transform: dotX == null ? 'translateX(-9999px)' : `translateX(${Math.round(dotX - 3)}px)` }}
            />
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                // Lock the dot to the clicked target for a smooth full slide
                setDotTargetId('about');
                setDotX(e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2);
                clearTimeout(dotLockTimerRef.current);
                dotLockTimerRef.current = setTimeout(() => setDotTargetId(null), 1200);
                scrollToSection('about');
              }}
              className={`${activeId === 'about' ? 'active' : ''} ${dotTargetId === 'about' ? 'target-active' : ''}`.trim()}
            >About</a>
            <a
              href="#works"
              onClick={(e) => {
                e.preventDefault();
                setDotTargetId('works');
                setDotX(e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2);
                clearTimeout(dotLockTimerRef.current);
                dotLockTimerRef.current = setTimeout(() => setDotTargetId(null), 1200);
                scrollToSection('works');
              }}
              className={`${activeId === 'works' ? 'active' : ''} ${dotTargetId === 'works' ? 'target-active' : ''}`.trim()}
            >Works</a>
            <a
              href="#stats"
              onClick={(e) => {
                e.preventDefault();
                setDotTargetId('stats');
                setDotX(e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2);
                clearTimeout(dotLockTimerRef.current);
                dotLockTimerRef.current = setTimeout(() => setDotTargetId(null), 1200);
                scrollToSection('stats');
              }}
              className={`${activeId === 'stats' ? 'active' : ''} ${dotTargetId === 'stats' ? 'target-active' : ''}`.trim()}
            >Stats</a>
            <a
              href="#testimonials"
              onClick={(e) => {
                e.preventDefault();
                setDotTargetId('testimonials');
                setDotX(e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2);
                clearTimeout(dotLockTimerRef.current);
                dotLockTimerRef.current = setTimeout(() => setDotTargetId(null), 1400);
                scrollToSection('testimonials');
              }}
              className={`${activeId === 'testimonials' ? 'active' : ''} ${dotTargetId === 'testimonials' ? 'target-active' : ''}`.trim()}
            >Comments</a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setDotTargetId('contact');
                setDotX(e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2);
                clearTimeout(dotLockTimerRef.current);
                dotLockTimerRef.current = setTimeout(() => setDotTargetId(null), 1600);
                scrollToSection('contact');
              }}
              className={`${activeId === 'contact' ? 'active' : ''} ${dotTargetId === 'contact' ? 'target-active' : ''}`.trim()}
            >Contact</a>
          </div>
        </div>
      </nav>
      <main id="top">
        <div className="reveal"><Hero /></div>
        <section className="reveal"><About /></section>
  <Works />
  <section className="reveal"><Stats modIds={['1247173', '1363130', '1362854']} /></section>
        <section className="reveal"><Testimonials /></section>
  <section className="reveal"><Contact /></section>
      </main>
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} KuSug — Bedrock Add-on Development</p>
        </div>
  </footer>
  <OverlayScrollbar />
    </div>
    )
}

export default Home;