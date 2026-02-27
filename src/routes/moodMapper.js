// Mapping abstract moods to TMDB Genre IDs
const moodMap = {
  energetic: [28, 12],     // Action, Adventure
  relaxed: [35, 10751],    // Comedy, Family
  thoughtful: [18, 99],     // Drama, Documentary
  adventurous: [14, 878],   // Fantasy, Sci-Fi
  melancholic: [18, 10749], // Drama, Romance
};

export const getGenresByMood = (mood) => {
  return moodMap[mood.toLowerCase()] || [18]; // Default to Drama
};