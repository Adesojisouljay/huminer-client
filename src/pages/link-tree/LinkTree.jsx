import React from "react";
import songs from "./songs";
import socials from "./socials";
import "./index.css";

export default function LinkTree() {
  return (
    <div className="linktree-container">
      <h1 className="linktree-title">🎶 My Music Linktree 🎶</h1>

      {/* Songs Section */}
      <div className="songs-section">
        {songs.map((song, idx) => (
          <div key={idx} className="card">
            <h2>{song.title}</h2>

            {/* Embedded player */}
            <div className="embed-container">
              <iframe
                src={song.embed}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                title={song.title}
              ></iframe>
            </div>

            {/* Links */}
            <div className="links">
              {Object.entries(song.links).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-button"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social Media */}
      <div className="socials-section">
        <h2>🌍 Connect with me</h2>
        <div className="social-links">
          {Object.entries(socials).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-button"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
