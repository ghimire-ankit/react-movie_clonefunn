import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import './MovieRow.css';

export default function MovieRow({ title, movies, linkTo, isLoading = false }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef(null);

  const checkArrows = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <section className="movie-row">
        <div className="movie-row-header page-container">
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="movie-row-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-poster"></div>
              <div className="skeleton-info">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <section className="movie-row">
      <div className="movie-row-header page-container">
        <h2 className="section-title">
          {linkTo ? (
            <Link to={linkTo} className="row-title-link">
              {title}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          ) : (
            title
          )}
        </h2>
      </div>

      <div className="movie-row-wrapper">
        {showLeftArrow && (
          <button className="row-arrow left" onClick={() => scroll('left')} aria-label="Scroll left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        <div
          className="movie-row-track"
          ref={rowRef}
          onScroll={checkArrows}
        >
          {movies.map((movie, index) => (
            <div className="movie-row-item" key={movie.id}>
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button className="row-arrow right" onClick={() => scroll('right')} aria-label="Scroll right">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
