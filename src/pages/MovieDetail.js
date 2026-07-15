import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import { getMovieDetails } from '../utils/api';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      setError(false);
      try {
        const data = await getMovieDetails(id);
        if (data) {
          setMovie(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="detail-error">
        <div className="error-state">
          <h2>Movie Not Found</h2>
          <p>We couldn't find the movie you're looking for.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const backdropStyle = movie.backdropUrl
    ? { backgroundImage: `url(${movie.backdropUrl})` }
    : { background: movie.placeholderGradient };

  return (
    <main className="movie-detail-page">
      {/* Backdrop Section */}
      <section className="detail-backdrop" style={backdropStyle}>
        <div className="detail-backdrop-overlay"></div>
        <div className="detail-backdrop-content">
          <div className="detail-poster-col">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="detail-poster" />
            ) : (
              <div className="detail-poster-placeholder" style={{ background: movie.placeholderGradient }}>
                <span>{movie.title?.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="detail-info-col">
            <div className="detail-badges">
              {movie.rating !== 'N/A' && (
                <span className="detail-badge rating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {movie.rating}/10
                </span>
              )}
              {movie.runtime && movie.runtime !== 'N/A' && (
                <span className="detail-badge">{movie.runtime}</span>
              )}
              {movie.year && movie.year !== 'TBD' && (
                <span className="detail-badge">{movie.year}</span>
              )}
              {movie.original_language && (
                <span className="detail-badge lang">{movie.original_language.toUpperCase()}</span>
              )}
            </div>

            <h1 className="detail-title">{movie.title}</h1>

            {movie.genres && movie.genres.length > 0 && (
              <div className="detail-genres">
                {movie.genres.map((genre) => (
                  <Link key={genre.id} to={`/browse?genre=${genre.id}`} className="detail-genre">
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            {movie.tagline && (
              <p className="detail-tagline">"{movie.tagline}"</p>
            )}

            <p className="detail-overview">{movie.overview}</p>

            {/* Director & Cast Highlights */}
            {movie.director && (
              <div className="detail-crew">
                <span className="crew-label">Director:</span>
                <span className="crew-name">{movie.director.name}</span>
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              {movie.trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${movie.trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="detail-cast page-container">
          <h2 className="section-title">Cast</h2>
          <div className="cast-grid">
            {movie.cast.map((actor, index) => (
              <div key={actor.id || index} className="cast-card">
                <div className="cast-avatar">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="cast-avatar-placeholder">
                      {actor.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <p className="cast-name">{actor.name}</p>
                <p className="cast-character">{actor.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {movie.recommendations && movie.recommendations.length > 0 && (
        <section className="page-container" style={{ marginTop: '40px' }}>
          <MovieRow title="You Might Also Like" movies={movie.recommendations} />
        </section>
      )}

      {/* Similar Movies */}
      {movie.similar && movie.similar.length > 0 && (
        <section className="page-container" style={{ marginTop: '40px' }}>
          <MovieRow title="Similar Movies" movies={movie.similar} />
        </section>
      )}
    </main>
  );
}
