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

    const isAdded = watchlistIds.includes(movieId);

    try {
      const response = await fetch(
        isAdded ? `${apiBaseUrl}/watchlist/${userId}/${movieId}` : `${apiBaseUrl}/watchlist`,
        {
          method: isAdded ? 'DELETE' : 'POST',
          headers: isAdded ? {} : { 'Content-Type': 'application/json' },
          body: isAdded ? null : JSON.stringify({ userId, movieId })
        }
      );

      if (response.ok) {
        setWatchlistIds((prev) =>
          isAdded ? prev.filter((id) => id !== movieId) : [...prev, movieId]
        );
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
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
