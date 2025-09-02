import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const clients = [
  {
    name: 'bhielabby.',
    avatar: 'https://cdn.discordapp.com/avatars/1217018151233916951/8eff776f8fc0ccd60949e3accbff5fb6?size=1024',
    comment:
      'Thank you so much, bro, for this incredible custom loading animation! The mod is amazing and works perfectly. I can\'t wait to try it on the server. Absolutely 5 out of 5 perfect! 🤩',
    rating: 5,
    images: ['https://media.discordapp.net/attachments/1409477369831489576/1411337580204658749/Screenshot_2025-08-30-22-09-35-698_com.mojang.minecraftpe.jpg?ex=68b6ed0c&is=68b59b8c&hm=ad92a43c6f39671083d29e779ef6c81fcc14ef5340d0ca09e302264d32a48bd9&=&format=webp&width=1733&height=800'],
  },
  {
    name: 'Sweet Japan',
    avatar: 'https://cdn.discordapp.com/avatars/1301027568757112832/c413b1d7ba296a590bc43bf0b6fde352?size=1024',
    comment:
      'Awesome work loved working with him! 5/5',
    rating: 5,
    images: [
      'https://media.discordapp.net/attachments/1409002826927177828/1411735205848289332/image.png?ex=68b70ddd&is=68b5bc5d&hm=5f502027cd98cd9a3015a387ef312a184146f13d6f7bde376bc50042c91da0de&=&format=webp&quality=lossless&width=1510&height=668',
    ],
  }
];

const StarRow = ({ rating = 5 }) => (
  <div className="stars" aria-label={`${rating} out of 5 stars`} title={`${rating} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="star" aria-hidden="true">{i < rating ? '★' : '☆'}</span>
    ))}
  </div>
);

const Testimonials = () => {
  const [lightbox, setLightbox] = useState({ open: false, closing: false, src: '', alt: '' });
  const closeBtnRef = useRef(null);

  const openLightbox = (src, alt) => {
    setLightbox({ open: true, closing: false, src, alt });
  };

  const closeLightbox = () => {
    setLightbox(prev => {
      if (!prev.open || prev.closing) return prev;
      return { ...prev, closing: true };
    });
    const timeout = setTimeout(() => {
      setLightbox({ open: false, closing: false, src: '', alt: '' });
    }, 180);
    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus?.();
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox.open]);

  useEffect(() => {
    const on = lightbox.open || lightbox.closing;
    if (on) document.body.classList.add('lightbox-open');
    else document.body.classList.remove('lightbox-open');
    return () => document.body.classList.remove('lightbox-open');
  }, [lightbox.open, lightbox.closing]);

  useEffect(() => {
    const locking = lightbox.open || lightbox.closing;
    if (!locking) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const preventScroll = (e) => { e.preventDefault(); };
    const preventKeys = (e) => {
      // Block common scroll keys
      const keys = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Spacebar'];
      if (keys.includes(e.key)) e.preventDefault();
    };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeys);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('wheel', preventScroll, { passive: false });
      window.removeEventListener('touchmove', preventScroll, { passive: false });
      window.removeEventListener('keydown', preventKeys);
    };
  }, [lightbox.open, lightbox.closing]);

  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <h2>Client Comments</h2>
        <div className="comments">
          {clients.map((c, idx) => (
            <div className="comment reveal" style={{ '--d': `${idx * 0.08}s` }} key={c.name}>
              <img className="comment-avatar" src={c.avatar} alt={`${c.name} avatar`} />
              <div className="comment-body">
                <div className="comment-head">
                  <strong>{c.name}</strong>
                </div>
                <StarRow rating={c.rating ?? 5} />
                <p>{c.comment}</p>
                {(() => {
                  const imgs = Array.isArray(c.images) ? c.images : (c.images ? [c.images] : []);
                  return imgs.length ? (
                    <div className="comment-media" role="list">
                      {imgs.map((src, i) => (
                        <img
                          key={`${c.name}-img-${i}`}
                          src={src}
                          alt={`${c.name} attachment ${i + 1}`}
                          role="listitem"
                          loading="lazy"
                          className="comment-media-img"
                          onClick={() => openLightbox(src, `${c.name} attachment ${i + 1}`)}
                        />
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          ))}
        </div>
        {(lightbox.open || lightbox.closing) && createPortal(
          (
            <div className={`lightbox${lightbox.closing ? ' closing' : ''}`} onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Image viewer">
              <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button
                  ref={closeBtnRef}
                  className="lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Close"
                  title="Close"
                >
                  ×
                </button>
                <img className={`lightbox-img${lightbox.closing ? ' closing' : ''}`} src={lightbox.src} alt={lightbox.alt || 'Zoomed image'} />
              </div>
            </div>
          ),
          document.body
        )}
      </div>
    </section>
  );
};

export default Testimonials;
