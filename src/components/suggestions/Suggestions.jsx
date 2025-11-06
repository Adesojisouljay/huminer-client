import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRandomUsers } from "../../api/userApi";
import { getRandomPosts } from "../../api/postApi";
import { followUserThunk, unfollowUserThunk } from "../../redux/userSlice";
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
              src={"https://i.ytimg.com/vi/-I41691rWiQ/hqdefault.jpg"}
              alt={person.username}
            />
            <div>
              <p className="suggestion-name">{person.username}</p>
              <span className="suggestion-handle">@{person.username}</span>
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
          {posts?.map((item, index) => (
            <a href={item.link} key={index} className="content-card">
              <img
                src={"https://i.ytimg.com/vi/-I41691rWiQ/hqdefault.jpg"}
                alt={item.title}
              />
              <div className="content-info">
                {/* <p className="content-title">{item.title}</p> */}
                <Link className="feed-title" to={`/post/${item?._id}`}><h2>{item?.title}</h2></Link>
                <span className="content-author">{item.author}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="suggestion-footer">
        <p>© {new Date().getFullYear()} HUMINER</p>
      </div>
    </aside>
  );
}
