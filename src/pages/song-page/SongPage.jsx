import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSongById } from "../../api/songs";
import "./index.css";

// ✅ Smart Embed URL + Config Generator
function getEmbedConfig(platform, url) {
  if (!url) return { embedUrl: null, height: 152 };

  if (url.includes("spotify.com")) {
    const embedUrl = url.replace("open.spotify.com/", "open.spotify.com/embed/");
    return { embedUrl, height: 152 };
  }

  if (url.includes("youtube.com/watch?v=")) {
    const embedUrl = url.replace("watch?v=", "embed/");
    return { embedUrl, height: 315 };
  }

//   if (url.includes("music.youtube.com/watch?v=")) {
//     const embedUrl = url.replace("watch?v=", "embed/");
//     return { embedUrl, height: 315 };
//   }

  if (url.includes("audiomack.com")) {
    const embedUrl = url.replace("audiomack.com/", "audiomack.com/embed/");
    return { embedUrl, height: 200 };
  }

//   if (url.includes("music.apple.com")) {
//     const embedUrl = url.replace("music.apple.com", "embed.music.apple.com");
//     return { embedUrl, height: 175 };
//   }

//   if (url.includes("soundcloud.com")) {
//     const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
//     return { embedUrl, height: 166 };
//   }

//   if (url.includes("deezer.com")) {
//     const match = url.match(/deezer\.com\/[a-z]+\/(track|album)\/(\d+)/);
//     if (match) {
//       const embedUrl = `https://widget.deezer.com/widget/dark/${match[1]}/${match[2]}`;
//       return { embedUrl, height: 200 };
//     }
//   }

  // fallback
  return { embedUrl: null, height: 200 };
}

export const SongLinkTree = ({ song }) => {
  if (!song) return null;

  return (
    <div className="song-container">
      <img src={song.coverArt} alt={song.title} className="song-cover" />

      <h1 className="song-title">{song.title}</h1>
      <p className="song-artist">{song.artist}</p>

      <div className="song-links">
        {song.platforms.map((p, index) => {
          const { embedUrl, height } = getEmbedConfig(p.platform, p.url);
          return (
            <div key={index} className="platform-section">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-btn"
              >
                Listen on{" "}
                {p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}
              </a>

              {embedUrl && (
                <div className="iframe-container">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height={height}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="song-footer">
        <p>
          <strong>Country:</strong> {song.userCountry}
        </p>
        <p>
          <strong>Plays:</strong> {song.plays}
        </p>
      </div>
    </div>
  );
};

export default function SongPage() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const data = await getSongById(id);
        setSong(data);
      } catch (err) {
        console.error("Failed to load song:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (!song) return <div className="text-center">Song not found.</div>;

  return <SongLinkTree song={song} />;
}
