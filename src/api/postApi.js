// src/api/postApi.js
import { API } from "./axios";

// Helper to attach auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("huminerToken");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// 🟢 CREATE a new post
export const createPost = async (postData) => {
  const response = await API.post("/posts", postData, getAuthHeaders());
  return response.data;
};

// 🟢 GET all posts (feed)
export const getAllPosts = async () => {
  const response = await API.get("/posts");
  return response.data;
};

// 🟢 GET single post by ID
export const getPostById = async (postId) => {
  const response = await API.get(`/posts/${postId}`);
  return response.data;
};

// 🟢 DELETE a post
export const deletePost = async (postId) => {
  const response = await API.delete(`/posts/${postId}`, getAuthHeaders());
  return response.data;
};

// 🟢 TIP a post
export const tipPost = async (postId, tipData) => {
  try {
    const response = await API.post(`/posts/${postId}/tip`, tipData, getAuthHeaders());

    return response.data;
  } catch (error) {
    console.log(error.response.data.message)
    alert(error.response.data.message)
  }
};

// 🟢 ADD a comment to a post
export const addComment = async (postId, commentData) => {
  const response = await API.post(`/posts/${postId}/comment`, commentData, getAuthHeaders());
  return response.data;
};

// 🟢 TIP a comment
export const tipComment = async (postId, commentId, tipData) => {
  try {
    const response = await API.post(
      `/posts/${postId}/comment/${commentId}/tip`,
      tipData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Tip comment error:", error.response?.data?.message || error.message);
    alert(error.response?.data?.message || "Error tipping comment");
    return { success: false };
  }
};

// 🆕 Get random posts (for "Suggested posts" or "Discover" sections)
export const getRandomPosts = async (limit = 5) => {
  const response = await API.get(`/posts/random/posts?limit=${limit}`);
  return response.data.posts;
};

export const getPostByUsername = async (username) => {
  const res = await API.get(`/posts/post/${username}`);
  return res.data.posts;
};

// 🆕 Get following posts
export const getFollowingPosts = async () => {
  const response = await API.get("/posts/following", getAuthHeaders());
  return response.data;
};

// 🆕 Like a post
export const likePost = async (postId) => {
  const response = await API.put(`/posts/${postId}/like`, {}, getAuthHeaders());
  return response.data; // returns { success, message, likes }
};
