'use client';

import React from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import type { MovieCardItem } from './types';

interface MovieActionCardProps {
  movie: MovieCardItem;
  variant: 'toggle' | 'remove';
  isActive?: boolean;
  onAction: (movieId: number) => void;
}

export default function MovieActionCard({
  movie,
  variant,
  isActive = false,
  onAction
}: MovieActionCardProps) {
  return (
    <div className="group relative aspect-auto bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300">
      <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />

      {variant === 'toggle' ? (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAction(movie.id)}
              className="p-2 bg-white rounded-full text-black hover:bg-gray-200 transition"
            >
              {isActive ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <p className="text-white text-xs font-bold truncate">{movie.title}</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onAction(movie.id)}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-700"
          >
            <Trash2 size={16} /> Remove
          </button>
        </div>
      )}
    </div>
  );
}