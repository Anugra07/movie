import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/enhanced-button';
import { SearchBar } from '@/components/SearchBar';
import { MovieGrid } from '@/components/MovieGrid';
import { Badge } from '@/components/ui/badge';
import { movieApi } from '@/utils/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [trending, popular, topRated] = await Promise.all([
          movieApi.getTrendingMovies('week'),
          movieApi.getPopularMovies(),
          movieApi.getTopRatedMovies(),
        ]);

        setTrendingMovies(trending.results);
        setPopularMovies(popular.results);
        setTopRatedMovies(topRated.results);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle search
  const handleSearch = async (query, filters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    
    if (!query.trim() && Object.keys(filters).length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let results;
      
      if (query.trim()) {
        // Text search
        results = await movieApi.searchMovies(query);
      } else {
        // Filter-only search using discover
        results = await movieApi.discoverMovies({
          genre: filters.genre,
          year: filters.year,
          vote_average_gte: filters.rating,
        });
      }
      
      setSearchResults(results.results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchFilters({});
    setSearchResults([]);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const isSearchActive = searchQuery.trim() !== '' || Object.keys(searchFilters).length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Discover Your Next
              <span className="block text-accent">
                Favorite Movie
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Search through thousands of movies, read reviews, and build your perfect watchlist
            </p>
            
            {/* Search Bar */}
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              className="mb-8"
            />

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="accent"
                size="lg"
                onClick={() => navigate('/watch-later')}
              >
                My Watch Later
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setActiveTab('trending')}
              >
                Browse Trending
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {isSearchActive ? (
          // Search Results
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Search Results
                </h2>
                {searchQuery && (
                  <p className="text-muted-foreground">
                    Showing results for "{searchQuery}"
                  </p>
                )}
              </div>
              <Badge variant="outline" className="bg-muted/50">
                {searchResults.length} results
              </Badge>
            </div>

            <MovieGrid
              movies={searchResults}
              onMovieClick={handleMovieClick}
              isLoading={isSearching}
              emptyMessage="Try adjusting your search terms or filters"
            />
          </div>
        ) : (
          // Browse Movies
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Trending This Week
                </h2>
                <p className="text-muted-foreground">
                  The hottest movies everyone's talking about
                </p>
              </div>
              <MovieGrid
                movies={trendingMovies}
                onMovieClick={handleMovieClick}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="popular" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Popular Movies
                </h2>
                <p className="text-muted-foreground">
                  Most watched movies right now
                </p>
              </div>
              <MovieGrid
                movies={popularMovies}
                onMovieClick={handleMovieClick}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="top-rated" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Top Rated Movies
                </h2>
                <p className="text-muted-foreground">
                  Critically acclaimed films you shouldn't miss
                </p>
              </div>
              <MovieGrid
                movies={topRatedMovies}
                onMovieClick={handleMovieClick}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </div>
  );
}