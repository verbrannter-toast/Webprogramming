'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MovieGridSection from '../components/movies/MovieGridSection';
import MovieActionCard from '../components/movies/MovieActionCard';
import type { MovieCardItem } from '../components/movies/types';

interface GenreMoviesPageProps {
  genre: string;
  heading?: string;
  slug: string;
  emptyStateText?: string;
  apiBaseUrl?: string;
}

const DEFAULT_API_URL = 'http://localhost:5000';

export default function GenreMoviesPage({
  genre,
  heading,
  slug,
  emptyStateText = 'No movies found for this genre.',
  apiBaseUrl = DEFAULT_API_URL
}: GenreMoviesPageProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [movies, setMovies] = useState<MovieCardItem[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedId = localStorage.getItem('userId');
    if (savedId) {
      setUserId(savedId);
    }

    fetch(`${apiBaseUrl}/movies`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((movie: MovieCardItem) => movie.genre === genre);
        setMovies(filtered);
      });
  }, [apiBaseUrl, genre]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    fetch(`${apiBaseUrl}/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => setWatchlistIds(data.map(Number)));
  }, [apiBaseUrl, userId]);

  const toggleWatchlist = async (movieId: number) => {
    if (!userId) {
      router.push('/login');
      return;
    }

    const res = await fetch(`${apiBaseUrl}/watchlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId })
    });
    const data = await res.json();

    setWatchlistIds((prev) => (
      data.status === 'added' ? [...prev, movieId] : prev.filter((id) => id !== movieId)
    ));
  };

  return (
    <div data-genre-slug={slug}>
      <MovieGridSection
        heading={heading ?? `${genre} Movies`}
        movies={movies}
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
    </div>
  );
}
