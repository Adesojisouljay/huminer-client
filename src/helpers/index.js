import axios from "axios";

export const getDaysUntilPayout = (payoutAt) => {
  if (!payoutAt) return "";

  const now = new Date();
  const payoutDate = new Date(payoutAt);
  const diffMs = payoutDate - now;

  if (diffMs <= 0) return "Paid out";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""} left until payout`;
  }

  if (remainingHours > 0) {
    return `${remainingHours} hour${remainingHours !== 1 ? "s" : ""} left until payout`;
  }

  if (remainingMinutes > 0) {
    return `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""} left until payout`;
  }

  return `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""} left until payout`;
};
  
  export  const uploadToCloudinary = async (file, type) => {
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

  // src/utils/formatTimeAgo.js

export const formatTimeAgo = (isoDate) => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now - date; // difference in milliseconds

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (seconds > 0) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;

  return "just now";
};
