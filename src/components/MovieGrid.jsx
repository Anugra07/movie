import React from 'react';
import { MovieCard, MovieCardSkeleton } from './MovieCard';
import { movieApi } from '@/utils/api';

export function MovieGrid({ 
  movies, 
  onMovieClick, 
  onWatchLaterChange,
  isLoading = false,
  className = "",
  showWatchLater = true,
  emptyMessage = "No movies found"
}) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 ${className}`}>
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl">🎬</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Movies Found</h3>
        <p className="text-muted-foreground max-w-md">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 ${className}`}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={onMovieClick}
          onWatchLaterChange={onWatchLaterChange}
          showWatchLater={showWatchLater}
        />
      ))}
    </div>
  );
}