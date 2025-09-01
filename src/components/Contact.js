import React, { useState } from 'react';

const Contact = () => {
  const discordUsername = 'itskrammingtime';
  const inviteUrl = 'https://discord.gg/3q97qPZmAC';
  const [copied, setCopied] = useState(false);

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
  // Keep the copied state visible a bit longer for clarity
  setTimeout(() => setCopied(false), 2800);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <h2>Contact Us</h2>
        <div className="contact-card">
          <p className="muted">Add me on Discord or join our server and create an order ticket.</p>
          <div className="contact-actions">
            <div className="copy-group">
              <button
                className={`btn btn-primary ${copied ? 'copied' : ''}`}
                onClick={copyUsername}
                aria-live="polite"
                aria-pressed={copied}
                disabled={copied}
                title={copied ? 'Username copied' : 'Copy Discord username'}
              >
                {copied ? 'Copied — itskrammingtime ✓' : `Add me on Discord — ${discordUsername}`}
              </button>
              <span className={`copy-indicator ${copied ? 'show' : ''}`} aria-hidden={!copied}>
                ✓ Copied
              </span>
            </div>
            <a
              className="btn btn-outline"
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord server (opens in new tab)"
            >
              Join Discord Server & Create Ticket
            </a>
          </div>
          <div className={`copy-status ${copied ? 'success' : ''}`} aria-live="polite" role="status">
            {copied ? 'Copied! Username is in your clipboard. Paste it in Discord to add me.' : `Click the button to copy the username: ${discordUsername}`}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
