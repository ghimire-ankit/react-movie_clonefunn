import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero({ movie }) {
  if (!movie) return null;

  const gradient = movie.backdropUrl
    ? `linear-gradient(to top, var(--bg-primary) 0%, rgba(10,10,15,0.6) 50%, rgba(10,10,15,0.2) 100%), linear-gradient(to right, var(--bg-primary) 0%, transparent 50%)`
    : movie.placeholderGradient;

  return (
    <section className="hero" style={{ background: gradient }}>
      {movie.backdropUrl && (
        <div className="hero-backdrop">
          <img
            src={movie.backdropUrl}
            alt=""
            className="hero-backdrop-img"
            loading="eager"
          />
          <div className="hero-backdrop-overlay"></div>
        </div>
      )}

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badges">
            {movie.rating !== 'N/A' && (
              <span className="hero-badge rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {movie.rating}
              </span>
            )}
            {movie.year && movie.year !== 'TBD' && (
              <span className="hero-badge year">{movie.year}</span>
            )}
            {movie.original_language && (
              <span className="hero-badge lang">{movie.original_language.toUpperCase()}</span>
            )}
          </div>

          <h1 className="hero-title">{movie.title}</h1>

          {movie.genreNames && movie.genreNames.length > 0 && (
            <div className="hero-genres">
              {movie.genreNames.map((name, i) => (
                <span key={i} className="hero-genre" style={{ color: movie.genreColors?.[i] }}>
                  {name}
                </span>
              ))}
            </div>
          )}

          <p className="hero-overview">{movie.overview?.slice(0, 200)}{movie.overview?.length > 200 ? '...' : ''}</p>

          <div className="hero-actions">
            <Link to={`/movie/${movie.id}`} className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              View Details
            </Link>
            <Link to="/browse" className="btn btn-secondary">
              Browse All
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-bottom-fade"></div>
    </section>
  );
}
