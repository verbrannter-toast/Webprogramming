'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieGridSection from '../components/movies/MovieGridSection';
import MovieActionCard from '../components/movies/MovieActionCard';
import type { MovieCardItem } from '../components/movies/types';

const API_URL = 'http://localhost:5000';

export default function SearchPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<MovieCardItem[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const query = (searchParams.get('q') ?? '').trim();

  useEffect(() => {
    const savedId = localStorage.getItem('userId');
    if (savedId) {
      setUserId(savedId);
    }

    fetch(`${API_URL}/movies`)
      .then((response) => response.json())
      .then((data: MovieCardItem[]) => {
        setAllMovies(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!userId) {
      setWatchlistIds([]);
      return;
    }

    fetch(`${API_URL}/watchlist/${userId}`)
      .then((response) => response.json())
      .then((data) => setWatchlistIds(data.map(Number)));
  }, [userId]);

  const filteredMovies = useMemo(() => {
    if (!query) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    return allMovies.filter((movie) => movie.title.toLowerCase().includes(normalizedQuery));
  }, [allMovies, query]);

  const toggleWatchlist = async (movieId: number) => {
    if (!userId) {
      alert('Please login to use the watchlist!');
      return;
    }

    const response = await fetch(`${API_URL}/watchlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId })
    });
    const data = await response.json();

    setWatchlistIds((previousIds) => (
      data.status === 'added'
        ? [...previousIds, movieId]
        : previousIds.filter((id) => id !== movieId)
    ));
  };

  const headingText = query ? `Search results for "${query}"` : 'Search Movies';
  const emptyStateText = isLoading
    ? 'Loading movies...'
    : query
      ? `No movies found for "${query}"`
      : 'Enter a movie name in search to see results.';

  return (
    <MovieGridSection
      heading={headingText}
      movies={isLoading ? [] : filteredMovies}
      emptyStateText={emptyStateText}
      renderMovieCard={(movie) => (
        <MovieActionCard
          key={movie.id}
          movie={movie}
          variant="toggle"
          isActive={watchlistIds.includes(movie.id)}
          onAction={toggleWatchlist}
        />
      )}
    />
  );
}