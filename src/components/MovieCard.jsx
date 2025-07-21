import React from 'react';
import { Star, Calendar, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { movieApi } from '@/utils/api';

export function MovieCard({ 
  movie, 
  onMovieClick, 
  onWatchLaterChange,
  showWatchLater = true,
  className = "" 
}) {
  const { toast } = useToast();
  const [isInWatchLater, setIsInWatchLater] = React.useState(
    movieApi.watchLaterStorage.isInWatchLater(movie.id)
  );

  const handleWatchLaterToggle = (e) => {
    e.stopPropagation();
    
    if (isInWatchLater) {
      movieApi.watchLaterStorage.remove(movie.id);
      setIsInWatchLater(false);
      toast({
        title: "Removed from Watch Later",
        description: `${movie.title} has been removed from your watch later list.`,
      });
    } else {
      movieApi.watchLaterStorage.add(movie);
      setIsInWatchLater(true);
      toast({
        title: "Added to Watch Later",
        description: `${movie.title} has been added to your watch later list.`,
      });
    }
    
    onWatchLaterChange?.();
  };

  const handleCardClick = () => {
    onMovieClick(movie.id);
  };

  return (
    <Card 
      className={`movie-card group cursor-pointer overflow-hidden border-border/50 hover:border-primary-glow/50 ${className}`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movieApi.getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay with rating */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/70 text-rating-star border-rating-star/30 backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current mr-1" />
            {movieApi.formatRating(movie.vote_average)}
          </Badge>
        </div>

        {/* Watch Later Button */}
        {showWatchLater && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={handleWatchLaterToggle}
          >
            {isInWatchLater ? (
              <BookmarkCheck className="w-4 h-4 text-accent" />
            ) : (
              <Bookmark className="w-4 h-4 text-white" />
            )}
          </Button>
        )}

        {/* Hover Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movieApi.formatYear(movie.release_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-rating-star" />
              <span>{movie.vote_count} votes</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        {movie.overview && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-rating-star" />
              <span className="text-sm font-medium">{movieApi.formatRating(movie.vote_average)}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({movie.vote_count} reviews)
            </span>
          </div>
          
          <Badge variant="outline" className="text-xs bg-muted/50">
            {movieApi.formatYear(movie.release_date)}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}

// Loading skeleton component
export function MovieCardSkeleton(props) {
  const className = props.className || "";
  return (
    <Card className={`movie-card overflow-hidden ${className}`}>
      <div className="aspect-[2/3] bg-muted animate-pulse" />
      <CardContent className="p-4">
        <div className="h-5 bg-muted rounded animate-pulse mb-2" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between w-full">
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
          <div className="h-4 bg-muted rounded animate-pulse w-12" />
        </div>
      </CardFooter>
    </Card>
  );
}