import axios from "axios";

const BASE_URL = "https://api.song.link/v1-alpha.1/links";

/**
 * Fetches all available platform links for a given song URL
 * (Spotify, Apple Music, YouTube, Deezer, etc.)
 * 
 * @param {string} songUrl - e.g. "https://open.spotify.com/track/1Wi25NXSrfhpcERiliwuyx"
 * @returns {Promise<object>} Odesli API response (parsed JSON)
 */
export const getSongLinks = async (songUrl) => {
  try {
    if (!songUrl) throw new Error("Song URL is required");

    const response = await axios.get(BASE_URL, {
      params: { url: songUrl },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching song links:", error.message);
    throw new Error("Failed to fetch song links");
  }
};
