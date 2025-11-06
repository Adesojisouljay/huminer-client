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
  console.log("Sending registration data:", userData);
  const response = await API.post("/users/register", userData);
  console.log("response...", response)
  return response.data; // ✅ Always return data
};

export const loginUser = async (credentials) => {
  const response = await API.post("/users/login", credentials);
  console.log(response)
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await API.get(`/users/${id}`);
  console.log("profile......", response)
  return response.data;
};

export const updateUserProfile = async (id, updates) => {
  const response = await API.put(`/${id}`, updates);
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
  console.log(userId)
  const response = await API.put(
    `/users/follow/${userId}`,
    {}, // no body
    getAuthHeaders() // attach Bearer token
  );
  console.log(response)
  return response.data;
};

// 🆕 Unfollow a user
export const unfollowUser = async (userId) => {
  const response = await API.put(
    `/users/unfollow/${userId}`,
    {}, // no body
    getAuthHeaders()
  );

  console.log(response)
  return response.data;
};

getRandomUsers()