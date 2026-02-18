'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  image: string;
  [key: string]: any;
}

const API_URL = 'http://localhost:5000';

export default function Watchlist() {
  const [userId, setUserId] = useState<string | null>(null);
  const [myList, setMyList] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  // fetch the full movie library on mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/movies')
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
    <div className="bg-[#141414] min-h-screen pt-24 px-4 md:px-12">
      <h1 className="text-white text-3xl font-bold mb-8">My List</h1>
      
      {myList.length === 0 ? (
        <p className="text-gray-500">Your watchlist is currently empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {myList.map((movie) => (
            <div key={movie.id} className="group relative aspect-auto bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300">
              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-700"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}