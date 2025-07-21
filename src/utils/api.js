import axios from 'axios';

// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance with interceptors for error handling
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.status_message || 'An error occurred while fetching data';
    console.error('TMDB API Error:', message);
    throw new Error(message);
  }
);

export const movieApi = {
  // API Methods
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query, page, include_adult: false }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getTrendingMovies: async (timeWindow = 'week') => {
    try {
      const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/top_rated', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/upcoming', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: { append_to_response: 'videos,credits,reviews' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getMovieCredits: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  },

  getMovieVideos: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      throw error;
    }
  },

  getMovieReviews: async (movieId, page = 1) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/reviews`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie reviews:', error);
      throw error;
    }
  },

  getGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  discoverMovies: async ({ page = 1, genre, year, sort_by = 'popularity.desc', vote_average_gte } = {}) => {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          page,
          with_genres: genre,
          primary_release_year: year,
          sort_by,
          'vote_average.gte': vote_average_gte,
          include_adult: false,
          include_video: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw error;
    }
  },

  // Watch Later Storage Methods
  watchLaterStorage: {
    get: () => {
      try {
        const saved = localStorage.getItem('watchLater');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
      }
    },

    add: (movie) => {
      try {
        const current = movieApi.watchLaterStorage.get();
        const updated = current.some(m => m.id === movie.id) 
          ? current 
          : [...current, movie];
        localStorage.setItem('watchLater', JSON.stringify(updated));
        return updated;
      } catch (error) {
        console.error('Error adding to watchLater:', error);
        return [];
      }
    },

    remove: (movieId) => {
      try {
        const current = movieApi.watchLaterStorage.get();
        const updated = current.filter(m => m.id !== movieId);
        localStorage.setItem('watchLater', JSON.stringify(updated));
        return updated;
      } catch (error) {
        console.error('Error removing from watchLater:', error);
        return [];
      }
    },

    isInWatchLater: (movieId) => {
      try {
        return movieApi.watchLaterStorage.get().some(m => m.id === movieId);
      } catch (error) {
        console.error('Error checking watchLater status:', error);
        return false;
      }
    },
  },

  // Image helper functions
  getImageUrl: (path, size = 'w500') => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl: (path, size = 'w1280') => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Format utilities
  formatRating: (rating) => {
    if (!rating) return '0.0';
    return (rating / 2).toFixed(1); // Convert from 10-point to 5-point scale
  },

  formatYear: (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  },

  formatRuntime: (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  },
};