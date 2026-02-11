'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000';
const CURRENT_USER_ID = 1;

// Use the same movie data or fetch from an API
const MOVIES = [
  { id: 101, title: "Comedy Movie", image: "" },
  { id: 102, title: "Action Movie", image: "" },
  { id: 103, title: "Horror Movie", image: "" },
  { id: 104, title: "Romance", image: "" },
  { id: 105, title: "Documentary", image: "" },
];

export default function Watchlist() {
  const [myList, setMyList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/watchlist/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(ids => {
        // Filter our local movie list to only show what's in the database
        const filtered = MOVIES.filter(movie => ids.includes(movie.id));
        setMyList(filtered);
      });
  }, []);

  const removeFromWatchlist = async (movieId: number) => {
    await fetch(`${API_URL}/watchlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, movieId })
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
            <div key={movie.id} className="group relative aspect-video bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300">
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