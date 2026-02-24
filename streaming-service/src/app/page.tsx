'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// --- Types & Config ---
interface Movie {
  id: number;
  genre: string;
  title: string;
  image: string;
}

interface WatchHistoryMovie extends Movie {
  progressPercent: number;
}

const API_URL = 'http://localhost:5000';

const FEATURED_MOVIE = {
  title: "The Godfather",
  description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
  image: "https://wallpapercave.com/wp/wp12115424.jpg"
};

// --- Sub-Components ---

const Row = ({
  title,
  movies,
  userId,
  watchlistIds,
  onToggleWatchlist,
  showProgress = false,
  progressByMovieId = {},
  emptyMessage
}: {
  title: string;
  movies: Movie[];
  userId: string | null;
  watchlistIds: number[];
  onToggleWatchlist: (event: React.MouseEvent<HTMLButtonElement>, movieId: number) => void;
  showProgress?: boolean;
  progressByMovieId?: Record<number, number>;
  emptyMessage?: string;
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [itemSpan, setItemSpan] = useState(0);

  useEffect(() => {
    setStartIndex(0);
  }, [movies.length, title]);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    const trackElement = trackRef.current;

    if (!viewportElement || !trackElement || movies.length === 0) {
      return;
    }

    const measure = () => {
      const firstCard = trackElement.querySelector('[data-row-card="true"]') as HTMLElement | null;
      if (!firstCard) {
        return;
      }

      const computedStyle = window.getComputedStyle(trackElement);
      const gap = Number.parseFloat(computedStyle.columnGap || computedStyle.gap || '16') || 16;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const peekWidth = Math.min(cardWidth / 2, 120);
      const fitCount = Math.max(1, Math.floor((viewportElement.clientWidth - peekWidth + gap) / (cardWidth + gap)));

      setVisibleCount(fitCount);
      setItemSpan(cardWidth + gap);

      setStartIndex((previousStart) => {
        if (previousStart >= movies.length) {
          return 0;
        }
        return previousStart;
      });
    };

    measure();

    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(viewportElement);

    return () => {
      observer.disconnect();
    };
  }, [movies.length]);

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + visibleCount < movies.length;
  const translateX = -(startIndex * itemSpan);

  const goNext = () => {
    setStartIndex((previousStart) => {
      const nextStart = previousStart + visibleCount;
      if (nextStart >= movies.length) {
        return previousStart;
      }
      return nextStart;
    });
  };

  const goPrevious = () => {
    setStartIndex((previousStart) => Math.max(0, previousStart - visibleCount));
  };

  return (
    <div className="px-4 md:px-12 py-4 space-y-2">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-100">{title}</h2>

      {movies.length === 0 ? (
        <p className="text-zinc-400 py-4">{emptyMessage ?? 'No movies to display.'}</p>
      ) : (
        <div ref={viewportRef} className="relative overflow-hidden py-4">
          <div
            ref={trackRef}
            className="flex gap-4 items-start transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translateX(${translateX}px)` }}
          >
        {movies.map((movie) => {
          const isAdded = watchlistIds.includes(movie.id);
          const progressPercent = progressByMovieId[movie.id] ?? 0;
          
          return (
            /* wrappping whole card in a link to the watch page */
            <Link 
              key={movie.id} 
              href={`/watch/${movie.id}`}
              data-row-card="true"
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
                    onClick={(e) => onToggleWatchlist(e, movie.id)}
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

              {showProgress && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${Math.max(3, Math.min(progressPercent, 100))}%` }}
                  />
                </div>
              )}
            </Link>
          );
        })}
          </div>

          {canGoLeft && (
            <button
              onClick={goPrevious}
              className="absolute left-0 top-0 bottom-0 w-14 md:w-20 flex items-center justify-center bg-black/45 hover:bg-black/75 transition cursor-pointer"
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft size={30} className="text-white" />
            </button>
          )}

          {canGoRight && (
            <button
              onClick={goNext}
              className="absolute right-0 top-0 bottom-0 w-14 md:w-20 flex items-center justify-center bg-black/45 hover:bg-black/75 transition cursor-pointer"
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight size={30} className="text-white" />
            </button>
          )}
        </div>
      )}
      </div>
  );
};

// --- Main Page ---

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [continueWatching, setContinueWatching] = useState<WatchHistoryMovie[]>([]);

  useEffect(() => {
    // get user
    const savedId = localStorage.getItem('userId');
    if (savedId) setUserId(savedId);

    // fetch movies from backend
    fetch('http://localhost:5000/movies')
      .then(res => res.json())
      .then(data => {
        setAllMovies(data);
      })
      .catch(err => {
        console.error('Failed to fetch movies', err);
      });
  }, []);

  useEffect(() => {
    if (!userId) {
      setWatchlistIds([]);
      setContinueWatching([]);
      return;
    }

    fetch(`${API_URL}/watchlist/${userId}`)
      .then(res => res.json())
      .then(data => setWatchlistIds(data.map(Number)))
      .catch(err => console.error('Failed to fetch watchlist', err));

    fetch(`${API_URL}/history/${userId}`)
      .then(res => res.json())
      .then(data => {
        const mappedMovies = data.map((item: WatchHistoryMovie) => ({
          id: item.id,
          genre: item.genre,
          title: item.title,
          image: item.image,
          progressPercent: item.progressPercent
        }));
        setContinueWatching(mappedMovies);
      })
      .catch(err => console.error('Failed to fetch watch history', err));
  }, [userId]);

const toggleWatchlist = async (event: React.MouseEvent<HTMLButtonElement>, movieId: number) => {
  event.preventDefault();
  event.stopPropagation();

  if (!userId) return alert('Please login!');

  const isAdded = watchlistIds.includes(movieId);

  try {
    const response = await fetch(
      isAdded ? `${API_URL}/watchlist/${userId}/${movieId}` : `${API_URL}/watchlist`, 
      {
        method: isAdded ? 'DELETE' : 'POST',
        headers: isAdded ? {} : { 'Content-Type': 'application/json' },
        body: isAdded ? null : JSON.stringify({ userId, movieId })
      }
    );

    if (response.ok) {
      setWatchlistIds(prev => 
        isAdded ? prev.filter(id => id !== movieId) : [...prev, movieId]
      );
    } else {
      alert('Operation failed on server');
    }
  } catch (error) {
    console.error('Connection error:', error);
    alert('Error connecting to backend server.');
  }
};

  const genres = Array.from(new Set(allMovies.map(m => m.genre)));

  const continueWatchingMovies = useMemo<Movie[]>(
    () => continueWatching.map((item) => ({
      id: item.id,
      genre: item.genre,
      title: item.title,
      image: item.image
    })),
    [continueWatching]
  );

  const continueProgressByMovieId = useMemo<Record<number, number>>(
    () => continueWatching.reduce<Record<number, number>>((accumulator, item) => {
      accumulator[item.id] = item.progressPercent;
      return accumulator;
    }, {}),
    [continueWatching]
  );

  const featuredMovieId = allMovies.find((movie) => movie.title === FEATURED_MOVIE.title)?.id ?? allMovies[0]?.id ?? 101;

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
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
            <Link href={`/watch/${featuredMovieId}`} className="flex-1 md:flex-none">
              <button className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-black rounded font-bold hover:bg-opacity-80 transition w-full cursor-pointer">
                <Play fill="black" /> Play
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Movie Rows*/}
      <div className="relative z-10 pb-20">
        {continueWatchingMovies.length > 0 && (
          <Row
            title="Continue Watching"
            movies={continueWatchingMovies}
            userId={userId}
            watchlistIds={watchlistIds}
            onToggleWatchlist={toggleWatchlist}
            showProgress
            progressByMovieId={continueProgressByMovieId}
          />
        )}

        <Row
          title="Trending Now"
          movies={allMovies}
          userId={userId}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />

        {genres.map(genre => (
          <Row 
            key={genre} 
            title={genre} 
            movies={allMovies.filter(m => m.genre === genre)} 
            userId={userId}
            watchlistIds={watchlistIds}
            onToggleWatchlist={toggleWatchlist}
          />
        ))}
      </div>
    </div>
  );
}