'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Bell, Search, ChevronDown, User, Plus, Check } from 'lucide-react';
import Link from 'next/link';

import { Navbar } from './components/navbar';

// --- Types & Config ---
interface Movie {
  id: number;
  genre: string;
  title: string;
  image: string;
}

const API_URL = 'http://localhost:5000';

const FEATURED_MOVIE = {
  title: "The Godfather",
  description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
  image: "https://wallpapercave.com/wp/wp12115424.jpg"
};

// --- Sub-Components ---

const Row = ({ title, movies, userId }: { title: string; movies: Movie[]; userId: string | null }) => {
  const [watchlist, setWatchlist] = useState<number[]>([]);

  // Fetch user's current watchlist IDs
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/watchlist/${userId}`)
      .then(res => res.json())
      .then(data => setWatchlist(data.map(Number)))
      .catch(err => console.error("API Error:", err));
  }, [userId]);

  const toggleWatchlist = async (e: React.MouseEvent, movieId: number) => {
    e.preventDefault(); // Prevents the Link from triggering
    e.stopPropagation(); // Stops the click event from bubbling up to the Link
    
    if (!userId) return alert("Please login to use the watchlist!");
    
    try {
      const response = await fetch(`${API_URL}/watchlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, movieId })
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
      
      <div className="flex gap-4 overflow-x-auto py-4 items-start scrollbar-hide">
        {movies.map((movie) => {
          const isAdded = watchlist.includes(movie.id);
          
          return (
            /* wrappping whole card in a link to the watch page */
            <Link 
              key={movie.id} 
              href={`/watch/${movie.id}`}
              className="group relative shrink-0 w-40 h-75 md:w-70 md:h-105 bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300 shadow-xl cursor-pointer"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex items-center gap-3">
                  {/* Toggle Button with stopPropagation */}
                  <button 
                    onClick={(e) => toggleWatchlist(e, movie.id)}
                    className="p-2 bg-white rounded-full text-black hover:bg-gray-200 transition-all active:scale-90 cursor-pointer"
                  >
                    {isAdded ? <Check size={18} /> : <Plus size={18} />}
                  </button>
                  
                  <div className="flex flex-col">
                    <p className="text-white text-xs font-bold truncate max-w-25">
                      {movie.title}
                    </p>
                    <span className="text-[10px] text-gray-300">Play Now</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Page ---

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get user
    const savedId = localStorage.getItem('userId');
    if (savedId) setUserId(savedId);

    // fetch movies from backend
    fetch('http://127.0.0.1:5000/movies')
      .then(res => res.json())
      .then(data => {
        setAllMovies(data);
        setLoading(false);
      });
  }, []);

  const genres = Array.from(new Set(allMovies.map(m => m.genre)));

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-[75vh] w-full flex flex-col justify-center">
        <img 
          src={FEATURED_MOVIE.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-70" 
          alt="Hero" 
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-[#141414] to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 px-4 md:px-12 max-w-4xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {FEATURED_MOVIE.title}
          </h1>
          <p className="text-sm md:text-lg text-gray-200 max-w-xl">
            {FEATURED_MOVIE.description}
          </p>
          <div className="flex gap-3">
            <Link href="/watch/1" className="flex-1 md:flex-none">
              <button className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-black rounded font-bold hover:bg-opacity-80 transition w-full cursor-pointer">
                <Play fill="black" /> Play
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Movie Rows*/}
      <div className="relative z-10 pb-20">
        <Row title="Trending Now" movies={allMovies} userId={userId} />
        {genres.map(genre => (
          <Row 
            key={genre} 
            title={genre} 
            movies={allMovies.filter(m => m.genre === genre)} 
            userId={userId} 
          />
        ))}
      </div>
    </div>
  );
}