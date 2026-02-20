'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';

// --- GENRE ON THIS PAGE ---
const CURRENT_GENRE = "Action"; 
// --------------------------------------

interface Movie {
  id: number;
  title: string;
  image: string;
  genre: string;
}

const API_URL = 'http://localhost:5000';

export default function GenrePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);

  useEffect(() => {
    // get user
    const savedId = localStorage.getItem('userId');
    if (savedId) setUserId(savedId);

    // fetch all movies and filter by genre
    fetch(`${API_URL}/movies`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((m: Movie) => m.genre === CURRENT_GENRE);
        setMovies(filtered);
      });
  }, []);

  // fetch watchlist to handle toggle icons
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/watchlist/${userId}`)
      .then(res => res.json())
      .then(data => setWatchlistIds(data.map(Number)));
  }, [userId]);

  const toggleWatchlist = async (movieId: number) => {
    if (!userId) return;
    const res = await fetch(`${API_URL}/watchlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId })
    });
    const data = await res.json();
    
    setWatchlistIds(prev => 
      data.status === 'added' ? [...prev, movieId] : prev.filter(id => id !== movieId)
    );
  };

  return (
    <div className="bg-[#141414] min-h-screen pt-24 px-4 md:px-24">
      <h1 className="text-white text-3xl font-bold mb-8">{CURRENT_GENRE} Movies</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => {
          const isAdded = watchlistIds.includes(movie.id);
          return (
            <div key={movie.id} className="group relative aspect-auto bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300">
              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleWatchlist(movie.id)}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-200 transition"
                  >
                    {isAdded ? <Check size={16} /> : <Plus size={16} />}
                  </button>
                  <p className="text-white text-xs font-bold truncate">{movie.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}