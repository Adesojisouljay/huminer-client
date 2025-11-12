import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./index.css";

export default function StoryViewer({ stories, startIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;

    clearTimeout(timerRef.current);

    // If image: show for 30s
    if (currentStory?.type === "image") {
      timerRef.current = setTimeout(() => {
        handleNext();
      }, 30000);
    }

    // If video/audio: wait until media ends
    if (currentStory?.type === "video" || currentStory?.type === "audio") {
      const media = videoRef.current;
      if (media) {
        media.onended = () => handleNext();
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose(); // close when finished
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer-content">
        <div className="story-user">
          <img
            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            alt="" 
            className="user-story-image"
          />
          <span>{currentStory?.user}</span>
        </div>
        <AiOutlineClose className="close-btn" onClick={onClose} />
        <div className="stories-container">
          {currentStory?.type === "image" && (
            <img className="image-story" src={currentStory?.url} alt={currentStory?.user} />
          )}

          {currentStory?.type === "video" && (
            <video className="video-story" ref={videoRef} src={currentStory?.url} controls autoPlay />
          )}

          {currentStory?.type === "audio" && (
            <div className="audio-story">
              <audio ref={videoRef} src={currentStory?.url} controls autoPlay />
            </div>
          )}
        </div>

        <button className="nav-btn left" onClick={handlePrev}>◀</button>
        <button className="nav-btn right" onClick={handleNext}>▶</button>
      </div>
    </div>
  );
}
