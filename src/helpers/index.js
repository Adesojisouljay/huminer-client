import axios from "axios";

export const getDaysUntilPayout = (payoutAt) => {
    if (!payoutAt) return null;
    const now = new Date();
    const payoutDate = new Date(payoutAt);
    const diffTime = payoutDate - now; // difference in ms
    if (diffTime <= 0) return "Paid out";
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""} left until payout`;
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