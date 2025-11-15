import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfileThunk } from "../../redux/userSlice";
import { uploadToCloudinary } from "../../helpers"; 
import "./modal.css";

export default function UpdateProfileModal({ activeUser, closeModal }) {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: activeUser?.fullName || "",
    bio: activeUser?.bio || "",
    profilePicture: activeUser?.profilePicture || "",
    coverPhoto: activeUser?.coverPhoto || "",
    gender: activeUser?.gender || "",
    dateOfBirth: activeUser?.dateOfBirth?.split("T")[0] || "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⬇ UPLOAD PROFILE IMAGE TO CLOUDINARY
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "image");
      setForm((prev) => ({ ...prev, profilePicture: url }));
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  // ⬇ UPLOAD COVER PHOTO TO CLOUDINARY
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "image");
      setForm((prev) => ({ ...prev, coverPhoto: url }));
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  const submitUpdates = () => {
    dispatch(updateUserProfileThunk({ id: activeUser._id, updates: form }));
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Update Profile</h2>

        <label>Full Name</label>
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />

        <label>Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} />

        {/* Profile Picture */}
        <label>Profile Picture</label>
        <input type="text" name="profilePicture" value={form.profilePicture} onChange={handleChange} placeholder="Paste image URL" />

        <input type="file" accept="image/*" onChange={handleProfileUpload} />
        {uploading && <p>Uploading profile image...</p>}

        {/* Cover Photo */}
        <label>Cover Photo</label>
        <input type="text" name="coverPhoto" value={form.coverPhoto} onChange={handleChange} placeholder="Paste image URL" />

        <input type="file" accept="image/*" onChange={handleCoverUpload} />
        {uploading && <p>Uploading cover photo...</p>}

        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={closeModal}>Cancel</button>
          <button className="save-btn" onClick={submitUpdates} disabled={uploading}>
            {uploading ? "Please wait..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
