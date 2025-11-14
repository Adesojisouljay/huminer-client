// src/api/notificationApi.js
import { API } from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("huminerToken");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

/**
 * Get all notifications for a user
 */
export const getNotifications = async (userId) => {
  const res = await API.get(`/notifications/${userId}`, getAuthHeaders());
  return res.data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (notificationId) => {
  const res = await API.put(
    `/notifications/mark-read/${notificationId}`,
    {},
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Mark ALL notifications as read
 */
export const markAllNotificationsRead = async (userId) => {
  const res = await API.put(
    `/notifications/mark-all/${userId}`,
    {},
    getAuthHeaders()
  );
  return res.data;
};
