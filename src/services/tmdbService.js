import axios from 'axios';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

// Initialize cache for 1 hour
const movieCache = new NodeCache({ stdTTL: 3600 });

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

/**
 * FETCH LIST OF MOVIES (Moods / Search / Actor)
 * Updated to support filtering by actor ID (castId)
 */
export const fetchMoviesFromTMDB = async (mood, query, page = 1, castId = null) => {
  try {
    // If a castId or mood is provided, we use 'discover'. If text is typed, we use 'search'.
    let endpoint = query ? '/search/movie' : '/discover/movie';
    const genreMap = { energetic: 28, relaxed: 35, thoughtful: 18, adventurous: 12, melancholic: 10749 };
    
    const params = {
      api_key: API_KEY,
      page,
      sort_by: 'popularity.desc',
      query: query || undefined,
      // Only apply mood genres if we aren't searching by actor or text
      with_genres: (!query && !castId) ? genreMap[mood?.toLowerCase()] : undefined,
      // NEW: Filter by actor ID
      with_cast: castId || undefined
    };

    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, { params });
    return {
      movies: response.data.results,
      hasMore: response.data.page < response.data.total_pages
    };
  } catch (error) {
    console.error("TMDB List Fetch Error:", error.message);
    throw error;
  }
};

/**
 * NEW: FETCH TRENDING MOVIES
 * Fetches the daily trending movies globally from TMDB.
 */
export const fetchTrendingMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
      params: { api_key: API_KEY }
    });
    return response.data.results;
  } catch (error) {
    console.error("TMDB Trending Fetch Error:", error.message);
    throw error;
  }
};

/**
 * FETCH SINGLE MOVIE DETAILS (Modal data)
 * This now includes "videos", "similar", "credits", and "watch/providers"
 */
export const fetchMovieDetails = async (movieId) => {
  const cacheKey = `movie_detail_${movieId}`;
  const cachedData = movieCache.get(cacheKey);
  
  if (cachedData) {
    console.log(`📦 Cache Hit: ${cacheKey}`);
    return cachedData;
  }

  try {
    console.log(`🌐 Fetching TMDB Details for: ${movieId}`);
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: { 
        api_key: API_KEY, 
        // UPDATED: Added 'watch/providers' to get streaming links
        append_to_response: 'videos,similar,credits,watch/providers' 
      }
    });

    // Save result to cache before returning
    movieCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("TMDB Detail Fetch Error:", error.message);
    throw error;
  }
};