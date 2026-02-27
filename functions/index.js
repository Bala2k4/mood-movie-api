const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const cors = require('cors')({ origin: true }); // Required for Firebase Functions

const app = express();
app.use(cors);

// 1. MOOD TO GENRE MAPPING
const MOOD_TO_GENRES = {
  energetic: "28",     // Action
  relaxed: "35",       // Comedy
  thoughtful: "18",    // Drama
  melancholic: "10749", // Romance
  adventurous: "12"    // Adventure
};

// 2. THE RECOMMENDATIONS ROUTE
app.get('/recommendations', async (req, res) => {
  try {
    const { mood, query, page = 1, castId } = req.query;
    // IMPORTANT: Set your TMDB key here or use firebase functions:config:set
    const TMDB_API_KEY = "f5e7b17b9d6e99b944796ee4d95f27f6"; 
    const BASE_URL = "https://api.themoviedb.org/3";

    let response;

    if (query) {
      // Logic for Search Bar
      response = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: TMDB_API_KEY, query, page }
      });
    } else if (castId) {
      // Logic for Clicking an Actor
      response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: { api_key: TMDB_API_KEY, with_cast: castId, page }
      });
    } else {
      // Logic for Mood Selection
      const genreId = MOOD_TO_GENRES[mood] || "28";
      response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: { 
          api_key: TMDB_API_KEY, 
          with_genres: genreId, 
          sort_by: "popularity.desc",
          page 
        }
      });
    }

    res.json({
      movies: response.data.results,
      hasMore: response.data.page < response.data.total_pages
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

// 3. TRENDING ROUTE (Optional but helpful for your first load)
app.get('/trending', async (req, res) => {
    try {
        const TMDB_API_KEY = "f5e7b17b9d6e99b944796ee4d95f27f6";
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week`, {
            params: { api_key: TMDB_API_KEY }
        });
        res.json(response.data.results);
    } catch (error) {
        res.status(500).send("Error fetching trending");
    }
});

// 4. MOVIE DETAILS ROUTE (For the Modal)
app.get('/movie/:id', async (req, res) => {
    try {
        const TMDB_API_KEY = "f5e7b17b9d6e99b944796ee4d95f27f6";
        const { id } = req.params;
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: { 
                api_key: TMDB_API_KEY, 
                append_to_response: "videos,credits,similar,watch/providers" 
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Error fetching details");
    }
});

exports.api = functions.https.onRequest(app);