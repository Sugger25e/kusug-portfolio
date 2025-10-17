import React, { useEffect, useRef, useState } from 'react';
import item2 from '../assets/works/streakify.png';
import item3 from '../assets/works/casino.jpg';
import item4 from '../assets/works/battlepass.png';
import item5 from '../assets/works/spin.png';

const items = [
  {
    title: 'Streak Up! Add-on',
    desc: 'Daily streak quests, an in-game shop, and more. Uses custom JSON UI and scripting for smooth and reliable progress.',
    tags: ['User Interface', 'Scripting', 'NPC Models'],
    link: 'https://www.curseforge.com/minecraft-bedrock/addons/streaks',
    linkText: 'See on Curseforge',
    imgs: [
      'https://media.forgecdn.net/attachments/1281/519/banner-png.png',
      'https://media.forgecdn.net/attachments/description/1247173/description_0df47b92-5db5-447c-b3d1-4233b19ad98a.png'
    ],
    autoplay: true,
    autoplayInterval: 4000,
  },
  {
    title: 'Advanced Compass Add-on',
    desc: 'This add-on transforms the standard compass into a powerful tracking device for survival explorers.',
    tags: ['User Interface', 'Scripting'],
    link: 'https://www.curseforge.com/minecraft-bedrock/addons/advanced-compass',
    linkText: 'See on Curseforge',
    imgs: [
      'https://media.forgecdn.net/attachments/1354/136/untitled-design-png.png',
      'https://media.forgecdn.net/attachments/description/1363130/description_4bb72b2e-4fd8-474f-a650-e8c0f9f58ea8.png'
    ],
    autoplay: true,
    autoplayInterval: 4000,
  },
  {
    title: 'Streakify Discord Bot [SOLD]',
    desc: 'A verified daily streak bot for your Discord server. Deprecated because it was already sold to a client.',
    tags: ['Scripting', 'Web Page'],
    img: item2,
    link: 'https://streakify-web.vercel.app/',
    linkText: 'View Website',
  },
  {
    title: "Mines Game",
    desc: "A fully functional game in Minecraft Bedrock with the use of UI and Scripting.",
    tags: ["Scripting", "User Interface", "Textures"],
    img: item3
  },
  {
    title: 'Battlepass System',
    desc: 'Supports percentage progress, with 3 different states.',
    tags: ['User Interface', 'Scripting'],
    img: item4
  },
  {
    title: 'Crate Spin',
    desc: 'Includes spin animation, spin sound, and functions.',
    tags: ['User Interface', 'Scripting'],
    img: item5,
    link: 'https://www.youtube.com/watch?v=xlj3JA3ZX_Y',
    linkText: 'Watch in YouTube'
  }
];

function WorkThumb({ img, imgs, title, ratio = '16 / 9', autoplay = false, autoplayInterval = 4000 }) {
  const sources = Array.isArray(imgs) && imgs.length > 0 ? imgs : (img ? [img] : []);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchRef = useRef({ x: 0, y: 0 });
  const hasMany = sources.length > 1;

  const next = (e) => {
    e?.preventDefault?.();
    if (!sources.length) return;
    setI((p) => (p + 1) % sources.length);
  };
  const prevFn = (e) => {
    e?.preventDefault?.();
    if (!sources.length) return;
    setI((p) => (p - 1 + sources.length) % sources.length);
  };

  useEffect(() => {
    if (!autoplay || !hasMany || paused) return;
    const id = setInterval(() => {
      setI((p) => (p + 1) % sources.length);
    }, Math.max(1500, autoplayInterval));
    return () => clearInterval(id);
  }, [autoplay, hasMany, paused, autoplayInterval, sources.length]);

  const onTouchStart = (e) => {
    const t = e.touches?.[0];
    if (t) touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dy) < 60) {
      if (dx < 0) next(); else prevFn();
    }
  };

  const containerRatio = '16 / 9';
  return (
    <div
      className="work-thumb"
      style={{ aspectRatio: containerRatio }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {sources.length > 0 ? (
        <div className="carousel" role="group" aria-label={`${title} screenshots`}>
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {sources.map((src, idx) => (
              <div className="carousel-slide" key={`${src}-${idx}`}>
                <img
                  className="work-img"
                  src={src}
                  loading="lazy"
                  alt={`${title} thumbnail ${idx + 1}`}
                />
              </div>
            ))}
          </div>
          {hasMany && (
            <div className="carousel-dots" role="group" aria-label="Slide navigation">
              <button className="dot-nav prev" aria-label="Previous" onClick={prevFn}>
                &#8249;
              </button>
              {sources.map((_, d) => (
                <button
                  key={d}
                  className={`dot ${d === i ? 'active' : ''}`}
                  aria-label={`Go to slide ${d + 1}`}
                  onClick={() => setI(d)}
                />
              ))}
              <button className="dot-nav next" aria-label="Next" onClick={next}>
                &#8250;
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="work-img placeholder" aria-hidden="true" />
      )}
    </div>
  );
}

const Works = () => {
  return (
    <section id="works" className="section works">
      <div className="container">
        <h2>Selected Work</h2>
        <div className="grid">
          {items.map((w, idx) => (
            <article
              className="work-card reveal"
              style={{ '--d': `${idx * 0.08}s` }}
              key={w.title}
            >
              <WorkThumb
                img={w.img}
                imgs={w.imgs}
                title={w.title}
                ratio={w.ratio}
                autoplay={w.autoplay}
                autoplayInterval={w.autoplayInterval}
              />
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
              <div className="chips">
                {(w.tags || []).map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              {w.link ? (
                <div className="work-actions">
                  <a
                    className="btn btn-outline btn-sm"
                    href={w.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${w.linkText || 'View more'} (opens in a new tab)`}
                  >
                    {w.linkText || 'View more'}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                      style={{ marginLeft: 6, verticalAlign: 'text-bottom' }}
                    >
                      <path d="M14 3h7v7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 3l-9 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="3" y="7" width="12" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </a>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Works;

