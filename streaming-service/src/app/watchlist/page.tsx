'use client';

import React, { useState, useEffect } from 'react';
import MovieGridSection from '../components/movies/MovieGridSection';
import MovieActionCard from '../components/movies/MovieActionCard';
import type { MovieCardItem } from '../components/movies/types';

const API_URL = 'http://localhost:5000';

export default function Watchlist() {
  const [userId, setUserId] = useState<string | null>(null);
  const [myList, setMyList] = useState<MovieCardItem[]>([]);
  const [allMovies, setAllMovies] = useState<MovieCardItem[]>([]);

  // fetch the full movie library on mount
  useEffect(() => {
    fetch('http://localhost:5000/movies')
      .then(res => res.json())
      .then(data => setAllMovies(data))
      .catch(err => console.error("Failed to load movie library", err));

    const savedId = localStorage.getItem('userId');
    if (savedId) setUserId(savedId);
  }, []);

  useEffect(() => {
    // only proceed if we have a user AND the movie data to compare against
    if (!userId || allMovies.length === 0) return;

    fetch(`${API_URL}/watchlist/${userId}`)
      .then(res => res.json())
      .then(ids => {
        const numericIds = ids.map(Number);
        const filtered = allMovies.filter(movie => numericIds.includes(movie.id));
        setMyList(filtered);
      })
      .catch(err => console.error("Error fetching user watchlist:", err));
      
  }, [userId, allMovies]); // Re-run when either is updated

  const removeFromWatchlist = async (movieId: number) => {
    await fetch(`${API_URL}/watchlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, movieId })
    });
    setMyList(prev => prev.filter(m => m.id !== movieId));
  };

  return (
    <MovieGridSection
      heading="My List"
      movies={myList}
      emptyStateText="Your watchlist is currently empty"
      horizontalPaddingClassName="px-4 md:px-12"
      renderMovieCard={(movie) => (
        <MovieActionCard
          key={movie.id}
          movie={movie}
          variant="remove"
          onAction={removeFromWatchlist}
        />
      )}
    />
  );
}