import React from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content page-container">
        <div className="footer-brand">
          <span className="brand-icon">▶</span>
          <span className="brand-text">StreamFlix</span>
        </div>

        <p className="footer-tagline">
          Your ultimate movie discovery platform. Powered by TMDB.
        </p>

        <div className="footer-links">
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="footer-link">
            TMDB
          </a>
          <a href="https://github.com/ankitghimire" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub
          </a>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} StreamFlix. Crafted with passion.</p>
          <p className="footer-attribution">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
