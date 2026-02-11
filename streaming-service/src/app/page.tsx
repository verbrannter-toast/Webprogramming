'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Bell, Search, ChevronDown, User, Plus, Check } from 'lucide-react';

import { Navbar } from './components/navbar';

// --- Types & Config ---
interface Movie {
  id: number;
  title: string;
  image: string;
}

const API_URL = 'http://localhost:5000';
// Mocking a logged-in user
const CURRENT_USER_ID = 1; 

const FEATURED_MOVIE = {
  title: "Cool Movie",
  description: "A really cool movie you have to watch",
  image: ""
};

const MOVIES: Movie[] = [
  { id: 101, title: "Comedy Movie", image: "" },
  { id: 102, title: "Action Movie", image: "" },
  { id: 103, title: "Horror Movie", image: "" },
  { id: 104, title: "Romance", image: "" },
  { id: 105, title: "Documentary", image: "" },
];

// --- Sub-Components ---

const Row = ({ title, movies }: { title: string; movies: Movie[] }) => {
  const [watchlist, setWatchlist] = useState<number[]>([]);

  // 1. Fetch current watchlist on mount
  useEffect(() => {
    fetch(`${API_URL}/watchlist/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(data => setWatchlist(data))
      .catch(err => console.error("Backend not running?", err));
  }, []);

  // 2. Toggle item in backend and update UI
  const toggleWatchlist = async (movieId: number) => {
    try {
      const response = await fetch(`${API_URL}/watchlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: CURRENT_USER_ID, movieId })
      });
      const data = await response.json();
      
      setWatchlist(prev => 
        data.status === 'added' ? [...prev, movieId] : prev.filter(id => id !== movieId)
      );
    } catch (err) {
      alert("Error connecting to backend server.");
    }
  };

  return (
    <div className="px-4 md:px-12 py-4 space-y-2">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-100">{title}</h2>
      <div className="flex gap-4 overflow-x-scroll scrollbar-hide py-4">
        {movies.map((movie) => {
          const isAdded = watchlist.includes(movie.id);
          return (
            <div key={movie.id} className="group relative min-w-[200px] md:min-w-[280px] aspect-video bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300 shadow-xl cursor-pointer">
              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleWatchlist(movie.id)}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-200 transition"
                  >
                    {isAdded ? <Check size={20} /> : <Plus size={20} />}
                  </button>
                  <p className="text-white text-sm font-bold">{movie.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Page ---

export default function Home() {
  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <img src={FEATURED_MOVIE.image} className="w-full h-full object-cover opacity-70" alt="Hero" />
        <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-[#141414] to-transparent" />
        
        <div className="absolute top-[35%] left-4 md:left-12 max-w-xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold">{FEATURED_MOVIE.title}</h1>
          <p className="text-lg text-gray-200">{FEATURED_MOVIE.description}</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded font-bold hover:bg-opacity-80 transition"><Play fill="black" /> Play</button>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="relative z-10 -mt-32 pb-20">
        <Row title="Trending Now" movies={MOVIES} />
      </div>
    </div>
  );
}