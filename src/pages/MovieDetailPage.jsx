import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  Users,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { movieApi } from '@/utils/api';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchLater, setIsInWatchLater] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadMovieData = async () => {
      setIsLoading(true);
      try {
        const movieId = parseInt(id);
        
        const [movieData, creditsData, reviewsData] = await Promise.all([
          movieApi.getMovieDetails(movieId),
          movieApi.getMovieCredits(movieId),
          movieApi.getMovieReviews(movieId),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setReviews(reviewsData.results);
        setIsInWatchLater(movieApi.watchLaterStorage.isInWatchLater(movieId));
      } catch (error) {
        console.error('Failed to load movie data:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMovieData();
  }, [id, toast]);

  const handleWatchLaterToggle = () => {
    if (!movie) return;

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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Movie Not Found</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const director = credits?.crew.find(person => person.job === 'Director');
  const mainCast = credits?.cast.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={movieApi.getBackdropUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
        )}
        
        <div className="relative container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <Card className="movie-card overflow-hidden">
                <img
                  src={movieApi.getImageUrl(movie.poster_path, 'w780')}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </Card>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-lg text-muted-foreground italic mb-4">
                    {movie.tagline}
                  </p>
                )}

                {/* Movie Stats */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-current text-rating-star" />
                    <span className="text-lg font-semibold">{movieApi.formatRating(movie.vote_average)}</span>
                    <span className="text-sm text-muted-foreground">({movie.vote_count} votes)</span>
                  </div>
                  
                  {movie.release_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{movieApi.formatYear(movie.release_date)}</span>
                    </div>
                  )}
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{movieApi.formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} className="genre-badge">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button
                    variant="watchLater"
                    size="lg"
                    onClick={handleWatchLaterToggle}
                  >
                    {isInWatchLater ? (
                      <>
                        <BookmarkCheck className="w-5 h-5 mr-2" />
                        In Watch Later
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5 mr-2" />
                        Add to Watch Later
                      </>
                    )}
                  </Button>
                </div>

                {/* Overview */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Director */}
                {director && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Director</h3>
                    <p className="text-muted-foreground">{director.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      {mainCast.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Cast
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {mainCast.map((actor) => (
              <Card key={actor.id} className="movie-card text-center">
                <CardContent className="p-4">
                  <img
                    src={movieApi.getImageUrl(actor.profile_path, 'w185')}
                    alt={actor.name}
                    className="w-full aspect-square object-cover rounded-md mb-3"
                  />
                  <h4 className="font-semibold text-sm text-foreground mb-1">
                    {actor.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {actor.character}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Award className="w-6 h-6" />
            Reviews
          </h2>
          
          <div className="space-y-6">
            {reviews.slice(0, 3).map((review) => (
              <Card key={review.id} className="movie-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {review.author_details.name || review.author}
                    </CardTitle>
                    {review.author_details.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-rating-star" />
                        <span className="text-sm font-semibold">
                          {review.author_details.rating}/10
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed line-clamp-4">
                    {review.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}