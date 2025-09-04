import './App.css';
import Hero from './components/Hero';
import About from './components/About';
import Works from './components/Works';
import Testimonials from './components/Testimonials';
import Stats from './components/Stats';
import Contact from './components/Contact';
import useRevealOnScroll from './hooks/useRevealOnScroll';
import OverlayScrollbar from './components/OverlayScrollbar';
import usePreventBodySelectOnDrag from './hooks/usePreventBodySelectOnDrag';
import React from 'react';

function App() {
  useRevealOnScroll([]);
  usePreventBodySelectOnDrag();
  const [navOpen, setNavOpen] = React.useState(false);
  const closeNav = () => setNavOpen(false);
  return (
    <div className="site">
      <nav className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand" onClick={closeNav}>KuSug</a>
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
          <div id="navMenu" className={`nav-links ${navOpen ? 'open' : ''}`}>
            <a href="#about" onClick={closeNav}>About</a>
            <a href="#works" onClick={closeNav}>Works</a>
            <a href="#stats" onClick={closeNav}>Stats</a>
            <a href="#testimonials" onClick={closeNav}>Comments</a>
            <a href="#contact" onClick={closeNav}>Contact</a>
          </div>
        </div>
      </nav>
      <main id="top">
        <div className="reveal"><Hero /></div>
        <section className="reveal"><About /></section>
  <Works />
  <section className="reveal"><Stats modId={1247173} /></section>
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
  );
}

export default App;
