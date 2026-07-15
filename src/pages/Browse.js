import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getPopular, getMoviesByGenre, getGenres, getTopRated } from '../utils/api';
import './Browse.css';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(searchParams.get('genre') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');

  // Load genres
  useEffect(() => {
    async function loadGenres() {
      const data = await getGenres();
      if (data) setGenres(data);
    }
    loadGenres();
  }, []);

  // Sync genre from URL
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam !== activeGenre) {
      setActiveGenre(genreParam || '');
      setPage(1);
    }
  }, [searchParams, activeGenre]);

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (activeGenre) {
        result = await getMoviesByGenre(activeGenre, page);
      } else if (sortBy === 'top_rated') {
        const data = await getTopRated(page);
        result = { movies: data, totalPages: 10 };
      } else {
        const data = await getPopular(page);
        result = { movies: data, totalPages: 10 };
      }
      setMovies(result?.movies || []);
      setTotalPages(result?.totalPages || 1);
    } catch (err) {
      console.error('Error browsing movies:', err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [activeGenre, page, sortBy]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleGenreChange = (genreId) => {
    if (genreId === activeGenre) {
      setActiveGenre('');
      setSearchParams({});
    } else {
      setActiveGenre(genreId);
      setSearchParams({ genre: genreId });
    }
    setPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="browse-page">
      <div className="browse-header">
        <div className="page-container">
          <h1 className="browse-title">Browse Movies</h1>
          <p className="browse-subtitle">Discover your next favorite film</p>
        </div>
      </div>

      <div className="page-container">
        {/* Sort Tabs */}
        <div className="browse-controls">
          <div className="sort-tabs">
            <button
              className={`sort-tab ${sortBy === 'popular' ? 'active' : ''}`}
              onClick={() => handleSortChange('popular')}
            >
              Popular
            </button>
            <button
              className={`sort-tab ${sortBy === 'top_rated' ? 'active' : ''}`}
              onClick={() => handleSortChange('top_rated')}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Genre Filters */}
        <div className="genre-filters">
          <button
            className={`genre-filter ${!activeGenre ? 'active' : ''}`}
            onClick={() => handleGenreChange('')}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-filter ${String(activeGenre) === String(genre.id) ? 'active' : ''}`}
              onClick={() => handleGenreChange(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="browse-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="browse-skeleton">
                <div className="skeleton-poster"></div>
                <div className="skeleton-info">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="browse-grid">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="browse-pagination">
                <button
                  className="btn btn-secondary"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {Math.min(totalPages, 10)}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={page >= Math.min(totalPages, 10)}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No movies found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </main>
  );
}
