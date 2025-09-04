import React from 'react';
import Embers from './Embers';

const Hero = () => {
  return (
    <section className="hero">
      <Embers />
      <div className="container">
  <h1 className="glitch" data-text="KuSug — Bedrock Add-on Devs">KuSug — Bedrock Add-on Devs</h1>
        <p className="tagline">JSON UI • Scripting • Texturing • 3D Modeling</p>
        <a href="#works" className="btn btn-primary">See our work</a>
      </div>
    </section>
  );
};

export default Hero;
