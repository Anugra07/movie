import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { movieApi } from '@/utils/api';

export function SearchBar({ 
  onSearch, 
  onClear, 
  placeholder = "Search movies, actors, or genres...",
  className = ""
}) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [genres, setGenres] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query or filters change
  useEffect(() => {
    if (debouncedQuery.trim() || Object.keys(filters).length > 0) {
      onSearch(debouncedQuery, filters);
    }
  }, [debouncedQuery, filters, onSearch]);

  // Load genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await movieApi.getGenres();
        setGenres(response.genres);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };
    loadGenres();
  }, []);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setFilters({});
    setDebouncedQuery('');
    onClear();
  };

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  }, []);

  const selectedGenre = genres.find(g => g.id === filters.genre);
  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Main Search Bar */}
      <div className="search-bar relative flex items-center rounded-lg p-2">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder={placeholder}
          className="pl-12 pr-20 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
        />
        
        <div className="absolute right-2 flex items-center gap-2">
          {/* Filter Button */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`relative ${hasActiveFilters ? 'text-accent' : ''}`}
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-6">
                <h3 className="font-semibold text-foreground">Filters</h3>
                
                {/* Genre Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Genre</Label>
                  <div className="flex flex-wrap gap-2">
                    {genres.slice(0, 10).map((genre) => (
                      <Badge
                        key={genre.id}
                        variant={filters.genre === genre.id ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          filters.genre === genre.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => 
                          updateFilter('genre', filters.genre === genre.id ? undefined : genre.id)
                        }
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Release Year: {filters.year || 'Any'}
                  </Label>
                  <Slider
                    value={[filters.year || 2024]}
                    onValueChange={([value]) => updateFilter('year', value)}
                    min={1950}
                    max={2024}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1950</span>
                    <span>2024</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Minimum Rating: {filters.rating ? `${filters.rating}/10` : 'Any'}
                  </Label>
                  <Slider
                    value={[filters.rating || 0]}
                    onValueChange={([value]) => updateFilter('rating', value > 0 ? value : undefined)}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({})}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear Button */}
          {(query || hasActiveFilters) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedGenre && (
            <Badge 
              variant="secondary" 
              className="bg-genre-badge text-secondary-foreground"
            >
              {selectedGenre.name}
              <button
                onClick={() => updateFilter('genre', undefined)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.year && (
            <Badge variant="secondary" className="bg-genre-badge text-secondary-foreground">
              {filters.year}
              <button
                onClick={() => updateFilter('year', undefined)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.rating && (
            <Badge variant="secondary" className="bg-genre-badge text-secondary-foreground">
              Rating: {filters.rating}+
              <button
                onClick={() => updateFilter('rating', undefined)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}