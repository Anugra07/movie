import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { movieApi } from '@/utils/api';

export default function WatchLaterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);

  useEffect(() => {
    const movies = movieApi.watchLaterStorage.get();
    setWatchLaterMovies(movies);
  }, []);

  const handleRemoveFromWatchLater = (movie) => {
    movieApi.watchLaterStorage.remove(movie.id);
    setWatchLaterMovies(movieApi.watchLaterStorage.get());
    toast({
      title: "Removed from Watch Later",
      description: `${movie.title} has been removed from your watch later list.`,
    });
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (watchLaterMovies.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Your Watch Later List is Empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Start adding movies to your watch later list to keep track of what you want to watch.
          </p>
          <Button onClick={() => navigate('/')}>
            Browse Movies
          </Button>
        </div>
      </div>
    );
  }

  // Group movies by year
  const moviesByYear = watchLaterMovies.reduce((acc, movie) => {
    const year = movie.release_date ? movieApi.formatYear(movie.release_date) : 'Unknown';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(movie);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(moviesByYear).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Watch Later ({watchLaterMovies.length} movies)
        </h1>

        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year}>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {year} ({moviesByYear[year].length} movies)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {moviesByYear[year].map((movie) => (
                  <div
                    key={movie.id}
                    className="group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <img
                      src={movieApi.getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/70 text-rating-star border-rating-star/30 backdrop-blur-sm">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          {movieApi.formatRating(movie.vote_average)}
                        </Badge>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWatchLater(movie);
                        }}
                      >
                        <BookmarkCheck className="w-4 h-4 text-accent" />
                      </Button>

                      {/* Movie Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {movie.title}
                        </h3>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{movieApi.formatYear(movie.release_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current text-rating-star" />
                            <span className="text-sm font-medium">{movieApi.formatRating(movie.vote_average)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}