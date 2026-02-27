import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Updated imports to include getTrending
import { getRecommendations, getSingleMovieInfo, getTrending } from './controllers/movieController.js';

dotenv.config();

const app = express();

// 1. Move to Port 5050 to solve the macOS 403 Forbidden conflict
const PORT = process.env.PORT || 5050;

// 2. CORS must be initialized BEFORE routes to prevent connection errors
app.use(cors()); 

app.use(express.json());

// 3. Define routes
app.get('/api/recommendations', getRecommendations);

// NEW ROUTE: Handles the movie detail request for the modal
app.get('/api/movie/:id', getSingleMovieInfo);

// NEW ROUTE: Handles fetching daily trending movies
app.get('/api/trending', getTrending);

// Base route for easy browser testing
app.get('/', (req, res) => {
  res.send('🚀 MoodMovie API is successfully running on Port 5050!');
});

app.listen(PORT, () => {
  console.log(`-------------------------------------------`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Port 5050 conflict avoided (AirPlay fix)`);
  console.log(`-------------------------------------------`);
});