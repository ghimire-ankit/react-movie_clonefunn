import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

export default function MovieCard({ movie, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Staggered animation delay
  const delay = Math.min(index * 0.05, 0.5);

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoaded(true);
  };

  const ratingColor = movie.rating >= 7 ? '#00d4aa' : movie.rating >= 5 ? '#f1c40f' : '#e74c3c';
  const showPlaceholder = !imageLoaded || imageError || !movie.posterUrl;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-card"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Poster */}
      <div className="movie-card-poster">
        {/* Always render gradient background behind the image */}
        <div
          className={`movie-card-bg ${!showPlaceholder && imageLoaded ? 'hidden' : ''}`}
          style={{ background: movie.placeholderGradient }}
        >
          <div className="placeholder-shimmer"></div>
          <span className="placeholder-text">{movie.title?.charAt(0) || '?'}</span>
        </div>

        {/* Actual image - will load from TMDB or picsum */}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={`movie-card-img ${imageLoaded ? 'loaded' : ''}`}
          style={imageError ? { display: 'none' } : {}}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="movie-card-rating" style={{ color: ratingColor }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={ratingColor}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{movie.rating}</span>
        </div>

        {/* Year Badge */}
        {movie.year && movie.year !== 'TBD' && (
          <span className="movie-card-year">{movie.year}</span>
        )}

        {/* Hover Overlay */}
        <div className="movie-card-overlay">
          <span className="overlay-text">View Details</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>

        <div className="movie-card-meta">
          {movie.year && movie.year !== 'TBD' && (
            <span className="meta-item">{movie.year}</span>
          )}
          {movie.original_language && (
            <span className="meta-item lang">{movie.original_language.toUpperCase()}</span>
          )}
        </div>

        {movie.genreNames && movie.genreNames.length > 0 && (
          <div className="movie-card-genres">
            {movie.genreNames.slice(0, 2).map((name, i) => (
              <span
                key={i}
                className="genre-tag"
                style={{ background: `${movie.genreColors?.[i] || '#666'}22` }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
