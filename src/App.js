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

function App() {
  useRevealOnScroll([]);
  usePreventBodySelectOnDrag();
  return (
    <div className="site">
      <nav className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand">KuSug</a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#works">Works</a>
            <a href="#stats">Stats</a>
            <a href="#testimonials">Comments</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>
      <main id="top">
        <div className="reveal"><Hero /></div>
        <section className="reveal"><About /></section>
        <section className="reveal"><Works /></section>
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
