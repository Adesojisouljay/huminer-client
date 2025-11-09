import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiMusicAiLine, RiCameraFill, RiVideoAddFill } from "react-icons/ri";
import { createPost } from "../../api/postApi";
import "./index.css";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  // raw file states
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);

  // preview URLs
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // ===== Helpers: file change handlers that also create previews =====
  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      // clear if user cancelled
      setImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      return;
    }

    // revoke existing preview
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    const preview = URL.createObjectURL(file);
    setImage(file);
    setImagePreview(preview);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setAudio(null);
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
        setAudioPreview(null);
      }
      return;
    }
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    const preview = URL.createObjectURL(file);
    setAudio(file);
    setAudioPreview(preview);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setVideo(null);
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
      }
      return;
    }
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    const preview = URL.createObjectURL(file);
    setVideo(file);
    setVideoPreview(preview);
  };

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      [imagePreview, audioPreview, videoPreview].forEach((p) => {
        if (p) URL.revokeObjectURL(p);
      });
    };
  }, [imagePreview, audioPreview, videoPreview]);

  // ===== Cloudinary upload helper =====
  const uploadToCloudinary = async (file, type) => {
    if (!file) throw new Error("No file provided to uploadToCloudinary");
    const formData = new FormData();
    formData.append("file", file);

    const preset = process.env.REACT_APP_CLOUDINARY_PRESET;
    const cloudUrl = process.env.REACT_APP_CLOUDINARY_URL;

    if (!preset || !cloudUrl) {
      throw new Error("Missing Cloudinary config (cloudUrl or PRESET).");
    }

    const resourceType =
      type === "image" ? "image" : type === "video" || type === "audio" ? "video" : "raw";
    const uploadUrl = `${cloudUrl}/${resourceType}/upload`;
    formData.append("upload_preset", preset);

    try {
      const res = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // optional: set timeout if you want
        // timeout: 120000
      });
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err.response?.data || err.message || err);
      throw err;
    }
  };

  // ===== Submit post =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postTitle.trim() || !content.trim()) {
      alert("Please add a title and some content before posting.");
      return;
    }

    setLoading(true);
    try {
      const mediaArray = [];

      // upload image
      if (image) {
        const url = await uploadToCloudinary(image, "image");
        mediaArray.push({ url, type: "image" });
      }

      // upload audio
      if (audio) {
        const url = await uploadToCloudinary(audio, "audio");
        mediaArray.push({ url, type: "audio" });
      }

      // upload video
      if (video) {
        const url = await uploadToCloudinary(video, "video");
        mediaArray.push({ url, type: "video" });
      }

      const postData = {
        title: postTitle,
        body: content,
        media: mediaArray,
        tags: [], // supply tags if needed
      };

      const res = await createPost(postData); // your API function
      console.log("Post created:", res);

      
      // Reset form + revoke previews
      setPostTitle("");
      setContent("");
      
      setImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      
      setAudio(null);
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
        setAudioPreview(null);
      }
      
      setVideo(null);
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
      }
      
      navigate(`/post/${res.post._id}`);
      // alert("Post created successfully");
    } catch (err) {
      console.error("Create post failed:", err);
      alert(err.response?.data?.message || err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="upload-row">
          <label className="file-upload tooltip">
            <RiCameraFill className="icon" />
            <span className="tooltip-text">Add Image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          <label className="file-upload tooltip">
            <RiMusicAiLine className="icon" />
            <span className="tooltip-text">Add Audio</span>
            <input type="file" accept="audio/*" onChange={handleAudioChange} />
          </label>

          <label className="file-upload tooltip">
            <RiVideoAddFill className="icon" />
            <span className="tooltip-text">Add Video</span>
            <input type="file" accept="video/*" onChange={handleVideoChange} />
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
            <button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          <div className="preview-section">
            {content || imagePreview || audioPreview || videoPreview ? (
              <>
                {postTitle && <h2>{postTitle}</h2>}
                {imagePreview && <img src={imagePreview} alt="Image preview" />}
                {audioPreview && <audio controls src={audioPreview} />}
                {videoPreview && <video controls src={videoPreview} />}
                {content && <p className="preview-text">{content?.split("\n").map((paragraph, idx) => (
                  paragraph.trim() && <p key={idx}>{paragraph}</p>
                ))}</p>}
              </>
            ) : (
              <div className="preview-placeholder">
                Start typing or add media to see your post preview here.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
