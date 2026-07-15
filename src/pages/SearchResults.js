import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../utils/api';
import './SearchResults.css';
import './Browse.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    async function fetchResults() {
      setLoading(true);
      try {
        const result = await searchMovies(query, page);
        setMovies(result?.movies || []);
        setTotalPages(result?.totalPages || 1);
      } catch (err) {
        console.error('Search error:', err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [query, page]);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  if (!query.trim()) {
    return (
      <main className="search-page">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Search for movies</h3>
          <p>Type a movie title above to get started.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="search-page">
      <div className="page-container">
        <div className="search-header">
          <h1 className="search-title">
            Search results for "<span className="accent">{query}</span>"
          </h1>
          {!loading && (
            <p className="search-count">{movies.length} movie{movies.length !== 1 ? 's' : ''} found</p>
          )}
        </div>

        {loading ? (            <div className="browse-grid">
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

            {totalPages > 1 && (
              <div className="browse-pagination">
                <button
                  className="btn btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {Math.min(totalPages, 10)}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={page >= Math.min(totalPages, 10)}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No results for "{query}"</h3>
            <p>Try different keywords or check the spelling.</p>
          </div>
        )}
      </div>
    </main>
  );
}
