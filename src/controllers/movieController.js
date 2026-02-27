import { fetchMoviesFromTMDB, fetchMovieDetails, fetchTrendingMovies } from '../services/tmdbService.js';

/**
 * Handles movie recommendations based on mood, search, pagination, and cast.
 * Updated to accept castId for actor-specific searches.
 */
export const getRecommendations = async (req, res) => {
  try {
    // Extract castId from the query parameters
    const { mood, query, page = 1, castId } = req.query;
    
    // Pass castId to the service function
    const data = await fetchMoviesFromTMDB(mood, query, page, castId);
    res.json(data);
  } catch (error) {
    console.error("Recommendations Error:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

/**
 * NEW: Fetches daily trending movies for the homepage
 */
export const getTrending = async (req, res) => {
  try {
    const movies = await fetchTrendingMovies();
    res.json(movies);
  } catch (error) {
    console.error("Trending Error:", error.message);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
};

/**
 * Fetches deep details, trailers, and cast credits for the modal
 */
export const getSingleMovieInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchMovieDetails(id);
    if (!data) return res.status(404).json({ error: "Movie not found" });
    res.json(data);
  } catch (error) {
    console.error("Detail Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};