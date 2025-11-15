import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "../../api/userApi";
import { followUserThunk, unfollowUserThunk } from "../../redux/userSlice";
import "./followList.css";

export default function FollowListModal({ title, users, closeModal }) {
  const { activeUser } = useSelector((state) => state.huminer);
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredUser, setHoveredUser] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const fetchedUsers = await Promise.all(
          users.map(async (id) => {
            const res = await getUserProfile(id);
            return res;
          })
        );

        setUserDetails(fetchedUsers.filter(Boolean));
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    if (users.length > 0) loadUsers();
    else setLoading(false);
  }, [users]);

  const handleFollow = async (userId) => {
    try {
      await dispatch(followUserThunk(userId)).unwrap();
    } catch (err) {
      console.error("Follow failed:", err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await dispatch(unfollowUserThunk(userId)).unwrap();
    } catch (err) {
      console.error("Unfollow failed:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{title}</h2>
          <button className="danger-btn" onClick={closeModal}>close</button>
        </div>

        {loading ? (
          <p className="empty-text">Loading...</p>
        ) : userDetails.length === 0 ? (
          <p className="empty-text">No {title.toLowerCase()} yet.</p>
        ) : (
          <div className="user-list">
            {userDetails.map((u) => {
              const isFollowing = activeUser?.following?.includes(u._id);

              return (
                <div key={u._id} className="user-row">
                  <div className="follow-user-info">
                    <img
                      src={
                        u.profilePicture ||
                        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      className="user-avatar"
                    />
                    <span>{u.username}</span>
                  </div>

                  <button
                    className={isFollowing ? "following-btn" : "follow-btn"}
                    onClick={() =>
                      isFollowing ? handleUnfollow(u._id) : handleFollow(u._id)
                    }
                    onMouseEnter={() => isFollowing && setHoveredUser(u._id)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    {isFollowing
                      ? hoveredUser === u._id
                        ? "Unfollow"
                        : "Following"
                      : "Follow back"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
