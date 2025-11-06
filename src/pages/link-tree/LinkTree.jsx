import React, { useState } from "react";
import { getSongLinks } from "../../api/songLinks";
import "./index.css";

// Define platform icons
const platformIcons = {
  spotify: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg",
  appleMusic: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applemusic.svg",
  itunes: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/itunes.svg",
  youtube: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg",
  youtubeMusic: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtubemusic.svg",
  deezer: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/deezer.svg",
  tidal: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tidal.svg",
  pandora: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/pandora.svg",
  amazonMusic: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazonmusic.svg",
  yandex: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoh4roEWnk1zTeeS-z4_qaK242s5spnrOm_Q&s",
  amazonStore: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazon.svg",
};

const SongLinks = () => {
  const [songUrl, setSongUrl] = useState("");
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSongData(null);
    setLoading(true);

    try {
      const data = await getSongLinks(songUrl);
      console.log(data)
      setSongData(data);
    } catch {
      setError("Failed to fetch song links. Please check your URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="song-links-container">
      <h2>🎵 Generate Your Song LinkTree</h2>

      <form onSubmit={handleSubmit} className="song-form">
        <input
          type="text"
          placeholder="Paste your Spotify, Apple Music or YouTube link..."
          value={songUrl}
          onChange={(e) => setSongUrl(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {songData && (
        <div className="song-result">
          {songData.entitiesByUniqueId && (() => {
            const entity = songData.entitiesByUniqueId[songData.entityUniqueId];
            return (
              <div className="song-info">
                <img src={entity.thumbnailUrl} alt={entity.title} />
                <h3>{entity.title}</h3>
                <p>{entity.artistName}</p>
              </div>
            );
          })()}

          <div className="platform-links">
            {Object.entries(songData.linksByPlatform).map(([platform, details]) => {
              const icon = platformIcons[platform];
              return (
                <a
                  key={platform}
                  href={details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="platform-btn"
                >
                  {icon && <img src={icon} alt={platform} className="platform-icon" />}
                  <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                </a>
              );
            })}
          </div>
          <iframe
              src="https://open.spotify.com/embed/track/1Wi25NXSrfhpcERiliwuyx"
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy">
            </iframe>

        </div>
      )}
    </div>
  );
};

export default SongLinks;
