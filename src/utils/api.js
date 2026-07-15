const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

// Fallback demo data when API key is not provided — ensures the site works out of the box
const DEMO_MOVIES = [
  { id: 1, title: 'Interceptor', overview: 'A gripping tale of courage and survival against all odds.', poster_path: null, backdrop_path: null, vote_average: 7.5, release_date: '2024-01-15', genre_ids: [28, 53], original_language: 'en' },
  { id: 2, title: 'Neon Dreams', overview: 'In a cyberpunk future, one hacker holds the key to humanity\'s survival.', poster_path: null, backdrop_path: null, vote_average: 8.2, release_date: '2024-03-22', genre_ids: [878, 28], original_language: 'en' },
  { id: 3, title: 'The Last Horizon', overview: 'A space crew must find a new home for humanity before Earth expires.', poster_path: null, backdrop_path: null, vote_average: 7.9, release_date: '2024-06-10', genre_ids: [878, 12], original_language: 'en' },
  { id: 4, title: 'Shadow Protocol', overview: 'An elite spy uncovers a conspiracy that threatens global security.', poster_path: null, backdrop_path: null, vote_average: 7.3, release_date: '2024-04-05', genre_ids: [28, 53], original_language: 'en' },
  { id: 5, title: 'Echoes of Time', overview: 'A scientist discovers a way to communicate with the past — with devastating consequences.', poster_path: null, backdrop_path: null, vote_average: 8.0, release_date: '2024-08-15', genre_ids: [878, 18], original_language: 'en' },
  { id: 6, title: 'Crimson Tide Rising', overview: 'When a naval captain goes rogue, only one officer can stop him.', poster_path: null, backdrop_path: null, vote_average: 7.1, release_date: '2024-02-28', genre_ids: [28, 12], original_language: 'en' },
  { id: 7, title: 'The Silent Forest', overview: 'A family moves to a remote cabin only to discover they are not alone.', poster_path: null, backdrop_path: null, vote_average: 6.8, release_date: '2024-10-31', genre_ids: [27, 53], original_language: 'en' },
  { id: 8, title: 'Velocity', overview: 'An underground street racer is pulled into a world of crime and high-stakes heists.', poster_path: null, backdrop_path: null, vote_average: 7.6, release_date: '2024-05-17', genre_ids: [28, 80], original_language: 'en' },
  { id: 9, title: 'Midnight in Paris Again', overview: 'A writer finds himself mysteriously transported to 1920s Paris each night.', poster_path: null, backdrop_path: null, vote_average: 7.8, release_date: '2024-07-04', genre_ids: [35, 18, 10749], original_language: 'en' },
  { id: 10, title: 'The Architect', overview: 'A brilliant architect designs a building that changes reality itself.', poster_path: null, backdrop_path: null, vote_average: 7.4, release_date: '2024-09-20', genre_ids: [878, 9648], original_language: 'en' },
  { id: 11, title: 'Wildfire', overview: 'Firefighters race against time to save a town from the largest wildfire in history.', poster_path: null, backdrop_path: null, vote_average: 7.2, release_date: '2024-11-08', genre_ids: [28, 18], original_language: 'en' },
  { id: 12, title: 'Pixel Perfect', overview: 'A video game character becomes self-aware and enters the real world.', poster_path: null, backdrop_path: null, vote_average: 7.7, release_date: '2024-12-25', genre_ids: [35, 878, 12], original_language: 'en' },
];

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

// Colors for genre badges
const GENRE_COLORS = {
  Action: '#e74c3c', Adventure: '#e67e22', Animation: '#9b59b6', Comedy: '#f1c40f',
  Crime: '#2c3e50', Drama: '#3498db', Family: '#2ecc71', Fantasy: '#8e44ad',
  Horror: '#c0392b', Mystery: '#1abc9c', Romance: '#e91e63', 'Sci-Fi': '#00bcd4',
  Thriller: '#607d8b', War: '#795548', Western: '#a0522d',
};

function getGenreName(id) {
  const genre = GENRES.find(g => g.id === id);
  return genre ? genre.name : 'Unknown';
}

function getGenreColor(name) {
  return GENRE_COLORS[name] || '#666';
}

// Generate a unique but consistent placeholder image URL for demo movies
function getDemoImageUrl(movieId, title, type = 'poster') {
  const seed = title ? title.toLowerCase().replace(/[^a-z0-9]/g, '') : `movie-${movieId}`;
  const size = type === 'poster' ? '400x600' : '1280x720';
  return `https://picsum.photos/seed/${seed}/${size}`;
}

function getImageUrl(path, size = 'w500') {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${IMG_BASE}/${size}${path}`;
}

function getBackdropUrl(path, movieId, title) {
  if (path) return getImageUrl(path, 'original');
  // Fallback to demo placeholder
  return getDemoImageUrl(movieId, title, 'backdrop');
}

function getPosterUrl(path, movieId, title) {
  if (path) return getImageUrl(path, 'w500');
  // Fallback to demo placeholder
  return getDemoImageUrl(movieId, title, 'poster');
}

// Generate gradient placeholder colors based on movie id
function getPlaceholderGradient(id) {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f5576c 0%, #ff758c 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
  ];
  const safeId = (id ?? 1);
  return gradients[Math.abs(safeId) % gradients.length];
}

// Strip HTML tags from strings
function stripHtml(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
}

// Helper to enrich movie with computed properties
function enrichMovie(movie) {
  return {
    ...movie,
    genreNames: (movie.genre_ids || []).map(getGenreName),
    genreColors: (movie.genre_ids || []).map(id => getGenreColor(getGenreName(id))),
    posterUrl: getPosterUrl(movie.poster_path, movie.id, movie.title),
    backdropUrl: getBackdropUrl(movie.backdrop_path, movie.id, movie.title),
    placeholderGradient: getPlaceholderGradient(movie.id),
    year: movie.release_date ? movie.release_date.split('-')[0] : 'TBD',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    overview: stripHtml(movie.overview || 'No overview available.'),
    title: movie.title || 'Untitled',
  };
}

// --------------- API Functions ---------------

async function fetchFromApi(endpoint, params = {}) {
  if (!API_KEY) return null;

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('TMDB API fetch failed, using demo data:', error.message);
    return null;
  }
}

// --------------- Data Fetching ---------------

export async function getTrending(timeWindow = 'week') {
  const data = await fetchFromApi(`/trending/movie/${timeWindow}`);
  if (data?.results) return data.results.map(enrichMovie);
  return DEMO_MOVIES.map(enrichMovie);
}

export async function getPopular(page = 1) {
  const data = await fetchFromApi('/movie/popular', { page });
  if (data?.results) return data.results.map(enrichMovie);
  return DEMO_MOVIES.map(enrichMovie);
}

export async function getTopRated(page = 1) {
  const data = await fetchFromApi('/movie/top_rated', { page });
  if (data?.results) return data.results.map(enrichMovie);
  return [...DEMO_MOVIES].sort((a, b) => b.vote_average - a.vote_average).map(enrichMovie);
}

export async function getUpcoming(page = 1) {
  const data = await fetchFromApi('/movie/upcoming', { page });
  if (data?.results) return data.results.map(enrichMovie);
  return DEMO_MOVIES.map(enrichMovie);
}

export async function getNowPlaying(page = 1) {
  const data = await fetchFromApi('/movie/now_playing', { page });
  if (data?.results) return data.results.map(enrichMovie);
  return DEMO_MOVIES.slice(0, 6).map(enrichMovie);
}

export async function getMovieDetails(movieId) {
  const data = await fetchFromApi(`/movie/${movieId}`, { append_to_response: 'credits,videos,recommendations,similar' });
  if (data) {
    const enriched = enrichMovie(data);
    enriched.genres = data.genres || [];
    enriched.cast = (data.credits?.cast || []).slice(0, 12);
    enriched.director = (data.credits?.crew || []).find(c => c.job === 'Director');
    enriched.trailer = (data.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
    enriched.runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : 'N/A';
    enriched.recommendations = (data.recommendations?.results || []).slice(0, 6).map(enrichMovie);
    enriched.similar = (data.similar?.results || []).slice(0, 6).map(enrichMovie);
    return enriched;
  }
  // Fallback: find movie in demo data
  const movie = DEMO_MOVIES.find(m => m.id === parseInt(movieId));
  if (movie) return enrichMovie(movie);
  return null;
}

export async function searchMovies(query, page = 1) {
  const data = await fetchFromApi('/search/movie', { query, page });
  if (data?.results) return { movies: data.results.map(enrichMovie), totalPages: data.total_pages };
  // Fallback: filter demo data
  const filtered = DEMO_MOVIES.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );
  return { movies: filtered.map(enrichMovie), totalPages: 1 };
}

export async function getMoviesByGenre(genreId, page = 1) {
  const data = await fetchFromApi('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' });
  if (data?.results) return { movies: data.results.map(enrichMovie), totalPages: data.total_pages };
  // Fallback: filter demo data by genre
  const filtered = DEMO_MOVIES.filter(m => m.genre_ids.includes(parseInt(genreId)));
  return { movies: filtered.map(enrichMovie), totalPages: 1 };
}

export async function getGenres() {
  const data = await fetchFromApi('/genre/movie/list');
  if (data?.genres) return data.genres;
  return GENRES;
}

export { GENRES, getGenreName, getGenreColor, getPlaceholderGradient };
