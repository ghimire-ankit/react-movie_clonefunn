import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrending, getPopular, getTopRated, getNowPlaying } from '../utils/api';
import './Home.css';

export default function Home() {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendingData, popularData, topRatedData, nowPlayingData] = await Promise.all([
          getTrending('week'),
          getPopular(),
          getTopRated(),
          getNowPlaying(),
        ]);

        setTrending(trendingData || []);
        setPopular(popularData || []);
        setTopRated(topRatedData || []);
        setNowPlaying(nowPlayingData || []);

        // Set hero movie from trending
        if (trendingData && trendingData.length > 0) {
          setHeroMovie(trendingData[0]);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="home-page">
      {heroMovie && <Hero movie={heroMovie} />}

      <div className="home-content">
        <MovieRow
          title="Trending Now"
          movies={trending}
          linkTo="/browse"
          isLoading={loading}
        />
        <MovieRow
          title="Popular"
          movies={popular}
          linkTo="/browse"
          isLoading={loading}
        />
        <MovieRow
          title="Top Rated"
          movies={topRated}
          linkTo="/browse"
          isLoading={loading}
        />
        <MovieRow
          title="Now Playing"
          movies={nowPlaying}
          linkTo="/browse"
          isLoading={loading}
        />
      </div>
    </main>
  );
}
