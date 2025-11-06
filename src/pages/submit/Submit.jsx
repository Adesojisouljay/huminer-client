import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RiMusicAiLine, RiCameraFill, RiVideoAddFill } from "react-icons/ri";
import { createPost } from "../../api/postApi";
import "./index.css";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [postTitle, setPostTitle] = useState("")
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!content.trim()) {
      alert("Please add some content before posting.");
      return;
    }
  
    const postData = {
      title: postTitle,
      body: content,
      image,
      audio,
      video,
    };
  
    try {
      setLoading(true);
      const res = await createPost(postData);
      console.log("✅ Post created successfully!", res);
      setContent("");
      setPostTitle("")
      setImage(null);
      setAudio(null);
      setVideo(null);
    } catch (err) {
      console.error("❌ Create post failed:", err);
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      {/* <h1>Create New Post</h1> */}
      <form onSubmit={handleSubmit} className="create-post-form">

      <div className="upload-row">
            <label className="file-upload tooltip">
              <RiCameraFill className="icon"/>
              <span className="tooltip-text">Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImage)}
              />
            </label>

            <label className="file-upload tooltip">
              <RiMusicAiLine className="icon"/>
              <span className="tooltip-text">Add Audio</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, setAudio)}
              />
            </label>

            <label className="file-upload tooltip">
              <RiVideoAddFill className="icon"/>
              <span className="tooltip-text">Add Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, setVideo)}
              />
            </label>
          </div>
        
        <div className="ed-pr-wrapper">
          <div className="editor-section">
            <input
              placeholder="Enter post title"
              value={postTitle}
              className="post-title" 
              type="text" 
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
            />

            <button type="submit">{loading ? "Posting..." : "Post"}</button>
          </div>

          {/* Right: preview */}
          <div className="preview-section">
            {(content || image || audio || video) ? (
              <>
                {image && <img src={image} alt="Preview" />}
                {audio && <audio controls src={audio}></audio>}
                {video && <video controls src={video}></video>}
                {content && <p className="preview-text">{content}</p>}
              </>
            ) : (
              <div className="preview-placeholder">
                Start typing or add media to see your post preview here.
              </div>
            )}
          </div>
        </div>
        {/* Left: editor */}

      </form>
    </div>
  );
}
