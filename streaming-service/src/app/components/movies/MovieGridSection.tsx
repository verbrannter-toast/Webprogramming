'use client';

import React from 'react';
import type { MovieCardItem } from './types';

interface MovieGridSectionProps {
  heading: string;
  movies: MovieCardItem[];
  emptyStateText: string;
  renderMovieCard: (movie: MovieCardItem) => React.ReactNode;
  horizontalPaddingClassName?: string;
}

export default function MovieGridSection({
  heading,
  movies,
  emptyStateText,
  renderMovieCard,
  horizontalPaddingClassName = 'px-4 md:px-24'
}: MovieGridSectionProps) {
  return (
    <div className={`bg-[#141414] min-h-screen pt-24 ${horizontalPaddingClassName}`}>
      <h1 className="text-white text-3xl font-bold mb-8">{heading}</h1>

      {movies.length === 0 ? (
        <p className="text-zinc-400">{emptyStateText}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => renderMovieCard(movie))}
        </div>
      )}
    </div>
  );
}