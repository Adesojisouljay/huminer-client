import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRandomUsers } from "../../api/userApi";
import { getRandomPosts } from "../../api/postApi";
import { followUserThunk, unfollowUserThunk } from "../../redux/userSlice";
import HuminerPostSample from "../../assets/HuminerPostSample.jpeg";
import "./index.css";

export default function Suggestions() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState({}); // track follow state

  const dispatch = useDispatch();
  const {activeUser} = useSelector((state) => state?.huminer);

  // Initialize following list when user is loaded
  useEffect(() => {
    if (activeUser?.following) {
      const followMap = {};
      activeUser.following.forEach((id) => (followMap[id] = true));
      setFollowing(followMap);
    }
  }, [activeUser]);

  // Fetch random users
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const randomUsers = await getRandomUsers(5);
        setUsers(randomUsers);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, []);

  // Fetch random posts
  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const randomPosts = await getRandomPosts(5);
        setPosts(randomPosts);
      } catch (error) {
        console.error("Failed to fetch random posts:", error);
      }
    };
    fetchRandomPosts();
  }, []);

  // === Handle Follow ===
  const handleFollow = async (userId) => {
    try {
      await dispatch(followUserThunk(userId)).unwrap();
      setFollowing((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      console.error("Follow failed:", err);
    }
  };

  // === Handle Unfollow ===
  const handleUnfollow = async (userId) => {
    try {
      await dispatch(unfollowUserThunk(userId)).unwrap();
      setFollowing((prev) => ({ ...prev, [userId]: false }));
    } catch (err) {
      console.error("Unfollow failed:", err);
    }
  };

  return (
    <aside className="suggestions">
      {/* Who to follow section */}
      <h3>Who to follow</h3>
      <ul>
        {users?.map((person) => (
          <li key={person._id} className="suggestion-item">
            <img
              src={person.profilePicture || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
              alt={person.username}
            />
            <div>
              <Link to={`/profile/${person.username}`}>
                <p className="suggestion-name">{person.username}</p>
                <span className="suggestion-handle">@{person.username}</span>
              </Link>
            </div>

            {following[person._id] ? (
              <button
                className="danger-btn"
                onClick={() => handleUnfollow(person._id)}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="follow-btn"
                onClick={() => handleFollow(person._id)}
              >
                Follow
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Suggested Content section */}
      <div className="suggested-content">
        <h3>Suggested content</h3>
        <div className="content-grid">
          {posts?.map((post, index) => {
            const visualMedia = post.media?.filter(m => m.type === "image") || [];
            return(
            <a href={post.link} key={index} className="content-card">
              <img
                src={visualMedia[0]?.url || HuminerPostSample}
                alt={post.title}
              />
              <div className="content-info">
                {/* <p className="content-title">{post.title}</p> */}
                <Link className="feed-title" to={`/post/${post?._id}`}><h2>{post?.title}</h2></Link>
                <span className="content-author">{post.author}</span>
              </div>
            </a>
          )})}
        </div>
      </div>

      <div className="suggestion-footer">
        <p>© {new Date().getFullYear()} HUMINER</p>
      </div>
    </aside>
  );
}
