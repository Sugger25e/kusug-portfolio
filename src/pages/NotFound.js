import { useState } from "react";
import logo from '../assets/logo.png';
import Embers from '../components/Embers';

function NotFound() {
        const [navOpen, setNavOpen] = useState(false);
        const closeNav = () => setNavOpen(false);

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
                      <div id="navMenu" className={`nav-links ${navOpen ? 'open' : ''}`}>
                        <a href="#about" onClick={closeNav}>About</a>
                        <a href="#works" onClick={closeNav}>Works</a>
                        <a href="#stats" onClick={closeNav}>Stats</a>
                        <a href="#testimonials" onClick={closeNav}>Comments</a>
                        <a href="#contact" onClick={closeNav}>Contact</a>
                      </div>
                    </div>
                  </nav>
                  
                  <header className="hero" style={{minHeight: '70vh', display: 'grid', alignItems: 'center'}}>
                    <Embers />
                    <div className="container" style={{textAlign: 'center'}}>
                      <h1 className="glitch" data-text="404" style={{ fontSize: 'clamp(72px, 14vw, 180px)' }}>404</h1>
                      <p className="tagline">Page not found. The page you’re looking for doesn’t exist or was moved.</p>
                      <a href="/" className="btn btn-primary" aria-label="Back to Home">Back to Home</a>
                    </div>
                  </header>
    </div>
    )
}

export default NotFound;