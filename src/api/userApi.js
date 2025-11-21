// src/api/userApi.js
import { API } from "./axios";

// Helper to attach auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("huminerToken");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// === AUTH & USER API CALLS ===
export const registerUser = async (userData) => {
  const response = await API.post("/users/register", userData);
  return response.data; // ✅ Always return data
};

export const loginUser = async (credentials) => {
  const response = await API.post("/users/login", credentials);
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
};

export const getUserByUsername = async (username) => {
  const response = await API.get(`/users/profile/${username}`);
  return response.data.user;
};

export const updateUserProfile = async (id, updates) => {
  // Spread the updates so backend receives raw fields
  const response = await API.put(`/users/profile/${id}`, { ...updates }, getAuthHeaders());
  return response.data;
};

// 🆕 Get all users
export const getAllUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

// 🆕 Get random users (for suggestions/friends list)
export const getRandomUsers = async (limit = 5) => {
  const response = await API.get(`/users/random/users?limit=${limit}`);
  return response.data;
};

// 🆕 Follow a user
export const followUser = async (userId) => {
  
  const response = await API.put(
    `/users/follow/${userId}`,
    {}, // no body
    getAuthHeaders() // attach Bearer token
  );

  return response.data;
};

// 🆕 Unfollow a user
export const unfollowUser = async (userId) => {
  const response = await API.put(
    `/users/unfollow/${userId}`,
    {}, // no body
    getAuthHeaders()
  );

  return response.data;
};

// 🆕 Claim pending rewards
export const claimRewards = async () => {
  const response = await API.post("/users/claim-rewards", {}, getAuthHeaders());
  console.log("respnse claim...", response)
  return response.data.user; // Returns the updated user object
};
