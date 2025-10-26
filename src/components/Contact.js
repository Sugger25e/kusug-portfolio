import React, { useCallback, useEffect, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { createPortal } from 'react-dom';

const TAG_OPTIONS = ['User Interface', 'Scripting', 'Discord Bot', 'Website'];

function TagSelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const ref = useRef(null);

  const toggle = (val) => {
    setSelected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((o) => !o);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={`tag-select ${open ? 'open' : ''}`} ref={ref}>
          <label htmlFor="tag">Tags <span className="req" aria-hidden="true">*</span></label>
  <input type="hidden" id="tag" name="tag" value={selected.join(', ')} />
      <button
        type="button"
        className="tag-select-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="tag-select-menu"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        {selected.length ? (
          <div className="selected-chips">
            {selected.map((s) => (
              <span className="chip" key={s}>{s}</span>
            ))}
          </div>
        ) : (
          <span className="placeholder">Choose tags</span>
        )}
        <span className="caret" aria-hidden="true" />
      </button>
      {open && (
        <div id="tag-select-menu" className="tag-select-menu" role="listbox" aria-multiselectable="true">
          {TAG_OPTIONS.map((opt) => {
            const isSel = selected.includes(opt);
            return (
              <div
                key={opt}
                role="option"
                aria-selected={isSel}
                className={`tag-option ${isSel ? 'selected' : ''}`}
                onClick={() => toggle(opt)}
              >
                <span className="checkbox">{isSel ? '✓' : ''}</span>
                <span className="label">{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Contact = () => {
  const discordUsername = 'itskrammingtime';
  const inviteUrl = 'https://discord.gg/3q97qPZmAC';
  const [copied, setCopied] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [sending, setSending] = useState(false);
  const [formKey, setFormKey] = useState(0); 
  const [method, setMethod] = useState('discord');
  const [images, setImages] = useState([]);
  const objectUrlsRef = useRef(new Set());
  const fileInputRef = useRef(null);
  const [lightbox, setLightbox] = useState({ open: false, closing: false, src: '', alt: '' });
  const closeBtnRef = useRef(null);
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const [hcaptchaError, setHcaptchaError] = useState('');
  const hcaptchaRef = useRef(null);
  const hcaptchaContainerRef = useRef(null);
  const [hcaptchaHighlight, setHcaptchaHighlight] = useState(false);

  const HCAPTCHA_SITE_KEY = process.env.REACT_APP_HCAPTCHA_SITE_KEY || '6a149c34-ac8a-47f4-9648-a110af0af4f2';

  const MAX_FILES = 5;
  const MAX_SIZE = 5 * 1024 * 1024;

  const addImages = (fileList) => {
    const list = Array.isArray(fileList) ? fileList : Array.from(fileList || []);
    if (!list.length) return;
    const picked = [];
    for (const f of list) {
      if (!f) continue;
      const isImage = (f.type && f.type.startsWith('image/')) || /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(f.name || '');
      if (!isImage) continue;
      picked.push(f);
    }
    if (!picked.length) return;
    setImages((prev) => {
      const remaining = Math.max(0, MAX_FILES - prev.length);
      if (!remaining) {
        setStatusText(`You can upload up to ${MAX_FILES} images.`);
        return prev;
      }
      const toAdd = picked.slice(0, remaining).filter((f) => {
        if (f.size > MAX_SIZE) {
          setStatusText(`Some images exceed 5MB and were skipped.`);
          return false;
        }
        return true;
      }).map((f) => {
        const url = URL.createObjectURL(f);
        objectUrlsRef.current.add(url);
        return { file: f, url };
      });
      return toAdd.length ? [...prev, ...toAdd] : prev;
    });
  };

  const onFilesPicked = (e) => {
    const list = e.target && e.target.files ? Array.from(e.target.files) : [];
    addImages(list);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(idx, 1);
      if (removed && removed.url) {
        URL.revokeObjectURL(removed.url);
        objectUrlsRef.current.delete(removed.url);
      }
      return copy;
    });
  };

  const openLightbox = (src, alt) => {
    setLightbox({ open: true, closing: false, src, alt });
  };

  const closeLightbox = useCallback(() => {
    setLightbox(prev => {
      if (!prev.open || prev.closing) return prev;
      return { ...prev, closing: true };
    });
    const timeout = setTimeout(() => {
      setLightbox({ open: false, closing: false, src: '', alt: '' });
    }, 180);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const urlSet = objectUrlsRef.current;
    return () => {
      for (const url of urlSet) {
        URL.revokeObjectURL(url);
      }
      urlSet.clear();
    };
  }, []);

  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
  closeBtnRef.current?.focus?.();
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox.open, closeLightbox]);

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

  const copyUsername = async () => {
    const text = discordUsername;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
  setCopied(true);

  setTimeout(() => setCopied(false), 2800);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const API_BASE = 'https://kusug-portfolio-backend.vercel.app';
//  const API_BASE = 'http://localhost:5173'


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
  const form = e.currentTarget; 
    const fd = new FormData(form);
      if (!HCAPTCHA_SITE_KEY) {
        setStatusText('hCaptcha is not configured. Please try again later.');
        return;
      }
      if (!hcaptchaToken) {
        const msg = 'Please verify the captcha before submitting.';
        setHcaptchaError(msg);
        setStatusText(msg);
        try {
          hcaptchaContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch {}
        setHcaptchaHighlight(true);
        setTimeout(() => setHcaptchaHighlight(false), 1800);
        return;
      }
      const tagsValue = String(fd.get('tag') || '').trim();
      if (!tagsValue) {
        setStatusText('Please select at least one tag.');
        return;
      }
      let nameField = '';
      let tagField = '';
      if (method === 'email') {
        nameField = String(fd.get('name') || '');
        const email = String(fd.get('email') || '');
        tagField = `method=email; email=${email}; categories=${tagsValue}`;
      } else {
        nameField = String(fd.get('discordUsername') || '');
        tagField = `method=discord; categories=${tagsValue}`;
      }
  const payload = {
        name: nameField,
        tag: tagField,
        subject: String(fd.get('subject') || ''),
        message: String(fd.get('message') || '')
      };

    setSending(true);
    setStatusText('Sending...');
    try {
      const url = API_BASE ? `${API_BASE}/api/contact` : '/api/contact';
      const hasImages = images && images.length > 0;
      let res;
      if (hasImages) {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('tag', payload.tag);
        formData.append('subject', payload.subject);
        formData.append('message', payload.message);
        formData.append('hcaptchaToken', hcaptchaToken);
        images.forEach((it) => formData.append('images', it.file));
        res = await fetch(url, { method: 'POST', body: formData });
      } else {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, hcaptchaToken })
        });
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatusText('Message sent! I will get back to you soon.');
  form.reset();
  setFormKey((k) => k + 1);
  setMethod('discord');
  setHcaptchaToken('');
  setHcaptchaError('');
  try { hcaptchaRef.current?.resetCaptcha?.(); } catch {}
  images.forEach((it) => {
    if (it?.url) {
      URL.revokeObjectURL(it.url);
      objectUrlsRef.current.delete(it.url);
    }
  });
  objectUrlsRef.current.clear();
  setImages([]);
      } else {
        setStatusText(data.error || 'Failed to send. Please try again later.');
      }
    } catch (err) {
      console.log(err)
      setStatusText('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-wrapper">
        <div className="contact-form">
          <h3>Contact me</h3>
          <form id="contactForm" onSubmit={handleSubmit}>
            <div>
              <label>Contact via</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <input type="radio" name="method" value="discord" checked={method === 'discord'} onChange={() => setMethod('discord')} />
                  Discord
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <input type="radio" name="method" value="email" checked={method === 'email'} onChange={() => setMethod('email')} />
                  Email
                </label>
              </div>
            </div>
            {method === 'email' ? (
              <>
                <div>
                    <label htmlFor="name">Your name <span className="req" aria-hidden="true">*</span></label>
                  <input id="name" name="name" type="text" required={method === 'email'} maxLength="100" />
                </div>
                <div>
                    <label htmlFor="email">Email <span className="req" aria-hidden="true">*</span></label>
                  <input id="email" name="email" type="email" required={method === 'email'} maxLength="120" />
                </div>
              </>
            ) : (
              <div>
                  <label htmlFor="discordUsername">Discord username <span className="req" aria-hidden="true">*</span></label>
                <input id="discordUsername" name="discordUsername" type="text" required={method === 'discord'} maxLength="100" placeholder="e.g., user#1234 or @user" />
              </div>
            )}
            <div key={formKey}>
              <TagSelect />
            </div>
            <div>
                <label htmlFor="subject">Subject <span className="req" aria-hidden="true">*</span></label>
              <input id="subject" name="subject" type="text" required maxLength="120" />
            </div>
            <div>
                <label htmlFor="message">Message <span className="req" aria-hidden="true">*</span></label>
              <textarea id="message" name="message" required maxLength="1900" rows="6"></textarea>
            </div>
            <div className="image-uploader">
              <label htmlFor="images">Images <span className="muted">(up to {MAX_FILES}, 5MB each)</span></label>
              <input
                id="images"
                ref={fileInputRef}
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={onFilesPicked}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-outline add-images-btn"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                disabled={images.length >= MAX_FILES}
              >
                {images.length >= MAX_FILES ? 'Image limit reached' : 'Add images'}
              </button>
              {images.length > 0 && (
                <div className="preview-grid">
                  {images.map((it, idx) => (
                    <div className="preview-item" key={idx} onClick={() => openLightbox(it.url, `Attachment ${idx+1}`)}>
                      <img src={it.url} alt={`selected-${idx+1}`} />
                      <button type="button" className="remove-btn" aria-label={`Remove image ${idx+1}`} onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              ref={hcaptchaContainerRef}
              style={{ margin: '12px 0', outline: hcaptchaHighlight ? '2px solid #d33' : 'none', borderRadius: 6, padding: hcaptchaHighlight ? 6 : 0 }}
            >
              {HCAPTCHA_SITE_KEY ? (
                <HCaptcha
                  ref={hcaptchaRef}
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={(tok) => { setHcaptchaToken(tok || ''); setHcaptchaError(''); }}
                  onExpire={() => { setHcaptchaToken(''); setHcaptchaError('hCaptcha expired. Please try again.'); }}
                  theme="light"
                />
              ) : (
                <p className="muted" style={{ color: '#a33' }}>hCaptcha not configured.</p>
              )}
              {hcaptchaError && <p style={{ color: '#a33', marginTop: 6 }} aria-live="assertive">{hcaptchaError}</p>}
            </div>
            <button type="submit" disabled={sending || !HCAPTCHA_SITE_KEY}>{sending ? 'Sending…' : 'Send'}</button>
            <p id="contactStatus" aria-live="polite">{statusText}</p>
          </form>
        </div>

        <div className="contact-alt">
          <h3>Discord</h3>
          <p className="muted" style={{ marginTop: 0 }}>Quickest way to reach me.</p>
          <p><strong>Username:</strong> {discordUsername}</p>
          <div className="contact-actions">
            <div className="copy-group">
              <button type="button" className={`btn btn-primary ${copied ? 'copied' : ''}`} onClick={copyUsername} aria-live="polite">
                {copied ? 'Copied' : 'Copy Username'}
              </button>
              <span className={`copy-indicator ${copied ? 'show' : ''}`}>
                Copied “{discordUsername}”
              </span>
            </div>
            <a className="btn btn-outline" href={inviteUrl} target="_blank" rel="noopener noreferrer">
              Join Server
            </a>
          </div>
        </div>
      </div>

      {(lightbox.open || lightbox.closing) && createPortal(
        (
          <div className={`lightbox${lightbox.closing ? ' closing' : ''}`} onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Image viewer">
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                ref={closeBtnRef}
                className="lightbox-close"
                type="button"
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

    </section>
  );
};

export default Contact;
