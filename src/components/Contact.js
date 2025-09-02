import React, { useEffect, useRef, useState } from 'react';

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
  {/* Hidden input for the existing submit script */}
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
  const [formKey, setFormKey] = useState(0); // remount TagSelect to clear after success
  const [method, setMethod] = useState('discord'); // 'discord' | 'email'

  const copyUsername = async () => {
    const text = discordUsername;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
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

  // API base: env override; localhost backend in dev; relative path in prod
  const API_BASE = 'https://kusug-portfolio-backend.vercel.app'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatusText('Sending...');
  const form = e.currentTarget; 
    const fd = new FormData(form);
      const tagsValue = String(fd.get('tag') || '').trim();
      if (!tagsValue) {
        setStatusText('Please select at least one tag.');
        setSending(false);
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

    try {
      const url = API_BASE ? `${API_BASE}/api/contact` : '/api/contact';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatusText('Message sent! I will get back to you soon.');
  form.reset();
        // Clear TagSelect by remounting
  setFormKey((k) => k + 1);
  setMethod('discord');
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
            <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
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

      <style>
        {`
          .contact-wrapper { display: grid; gap: 2rem; grid-template-columns: 1fr 1fr; align-items: start; }
          @media (max-width: 800px) { .contact-wrapper { grid-template-columns: 1fr; } }
          form > div { margin-bottom: 0.75rem; }
          input, textarea, select { width: 100%; padding: 0.5rem; }
          button { padding: 0.6rem 1rem; }
          #contactStatus { margin-top: 0.5rem; }
        `}
      </style>

  {/* Removed inline script in favor of React onSubmit handler */}
    </section>
  );
};

export default Contact;
