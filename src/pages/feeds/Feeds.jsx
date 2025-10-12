import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { TbMoneybag } from "react-icons/tb";
import TipPopup from "../../components/tip-popup/TipPopup";
import StoryViewer from "../../components/stories/Stories";
import "./index.css";

export default function FeedPage() {
  const [balance, setBalance] = useState(5000);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);

  const [age, setAge] = useState(20)

  // Filter control
  const [filterType, setFilterType] = useState("latest");

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Soji",
      title: "Check out my new song!",
      content: "I just released a fresh track and I’m so excited to share it with you guys! 🎶🔥",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1RjPbiW0rp7uKIasNl4SdZuCiQpQFQDejQ&s",
      likes: 5,
      tippedAmount: 800,
      comments: 2,
      likedBy: ["Jane", "Mike", "Ada", "Kola", "Tosin"]
    },
    {
      id: 2,
      author: "Jane",
      title: "Here’s a beat I made today",
      content: "Spent all night working on this Afrobeat fusion. Let me know what you think!",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQk4JXGwXZ1IyOXV89T6jet91iIL8jLWaQ6A&s",
      likes: 3,
      tippedAmount: 400,
      comments: 1,
      likedBy: ["Soji", "Mike", "Tolu"]
    },
    {
      id: 3,
      author: "Mike",
      title: "Live Challenge Performance",
      content: "This is my entry for the Best Freestyle Challenge. Hope y’all enjoy!",
      image: "https://yt3.googleusercontent.com/koaN-6f8KrvOd5iXkwLsM5cbgRbuOWbD6v2jf8eUkARFPPvyAmnbacuLo_r-GTb8L6mIXlDtB6A=s900-c-k-c0x00ffffff-no-rj",
      likes: 8,
      tippedAmount: 1500,
      comments: 4,
      likedBy: ["Soji", "Jane", "Kola", "Tosin", "Ada", "Mike", "Chika", "Lola"]
    },
    {
      id: 4,
      author: "Mike",
      title: "Live Challenge Performance",
      content: "This is my entry for the Best Freestyle Challenge. Hope y’all enjoy!",
      image: "https://i.ytimg.com/vi/2SfxiN4CLXM/sddefault.jpg?v=657915cf",
      likes: 2,
      tippedAmount: 300,
      comments: 0,
      likedBy: ["Jane", "Tolu"]
    },
    {
      id: 5,
      author: "Mike",
      title: "Live Challenge Performance",
      content: "This is my entry for the Best Freestyle Challenge. Hope y’all enjoy!",
      image: "https://img.youtube.com/vi/-I41691rWiQ/hqdefault.jpg",
      likes: 6,
      tippedAmount: 2200,
      comments: 3,
      likedBy: ["Soji", "Ada", "Mike", "Tosin", "Jane", "Kola"]
    },
  ]);

  const [stories] = useState([
    { id: 1, user: "Soji", type: "image", url: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, user: "Jane", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 3, user: "Mike", type: "audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 4, user: "Tolu", type: "image", url: "https://randomuser.me/api/portraits/women/90.jpg" },
    { id: 5, user: "Ada", type: "image", url: "https://randomuser.me/api/portraits/women/21.jpg" },
    { id: 6, user: "Soji", type: "image", url: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 7, user: "Jane", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 8, user: "Mike", type: "audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 9, user: "Tolu", type: "image", url: "https://randomuser.me/api/portraits/women/90.jpg" },
    { id: 10, user: "Ada", type: "image", url: "https://randomuser.me/api/portraits/women/21.jpg" },
    { id: 11, user: "Soji", type: "image", url: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 12, user: "Jane", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 13, user: "Mike", type: "audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 14, user: "Tolu", type: "image", url: "https://randomuser.me/api/portraits/women/90.jpg" },
    { id: 15, user: "Ada", type: "image", url: "https://randomuser.me/api/portraits/women/21.jpg" }
  ]);

  const following = ["Jane", "Tolu"]; // mock following list
  const artists = ["Soji", "Mike"];   // mock artist list
  const challengeKeywords = ["challenge", "freestyle"]; // keywords for challenge posts

  const getFilteredPosts = () => {
    if (filterType === "following") {
      return posts.filter(p => following.includes(p.author));
    }
    if (filterType === "artists") {
      return posts.filter(p => artists.includes(p.author));
    }
    if (filterType === "challenges") {
      return posts.filter(p =>
        challengeKeywords.some(kw => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw))
      );
    }
    return posts; // latest - no filter
  };

  const handleTip = (amount) => {
    if (amount > balance) {
      alert("You don't have enough balance!");
      return;
    }
    setPosts(prev =>
      prev.map(post =>
        post.id === selectedPost
          ? {
              ...post,
              likes: post.likes + 1,
              tippedAmount: post.tippedAmount + amount,
              likedBy: [...post.likedBy, "You"]
            }
          : post
      )
    );
    setBalance(balance - amount);
    setSelectedPost(null);
  };

  return (
    <div className="feed-page">
      <h1>🎵 Feed</h1>

      {/* Filter buttons */}
      <div className="filter-bar">
        <button onClick={() => setFilterType("latest")} className={filterType === "latest" ? "active" : ""}>Latest</button>
        <button onClick={() => setFilterType("following")} className={filterType === "following" ? "active" : ""}>Following</button>
        <button onClick={() => setFilterType("artists")} className={filterType === "artists" ? "active" : ""}>Artists</button>
        <button onClick={() => setFilterType("challenges")} className={filterType === "challenges" ? "active" : ""}>Challenges</button>
      </div>

      <div className="stories-bar">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="story-circle"
            onClick={() => setSelectedStoryIndex(index)}
          >
            {story.type === "image" && <img src={story.url} alt={story.user} />}
            {story.type === "video" && <video src={story.url} muted />}
            {story.type === "audio" && <div className="audio-thumbnail">🎵</div>}
            <span>{story.user}</span>
          </div>
        ))}
        {selectedStoryIndex !== null && (
          <StoryViewer
            stories={stories}
            startIndex={selectedStoryIndex}
            onClose={() => setSelectedStoryIndex(null)}
          />
        )}
      </div>

      <div className="feed-list">
        {getFilteredPosts().map((post) => (
          <div className="feed-card" key={post.id}>
            <img src={post.image} alt={post.title} className="feed-image" />
            <div className="feed-content">
              <Link className="feed-title" to={`/post/${post.id}`}><h2>{post.title}</h2></Link>
              <p className="feed-author">By {post.author}</p>
              <p className="feed-snippet">
                {post.content.length > 80 ? post.content.substring(0, 80) + "..." : post.content}
              </p>

              <div className="feed-stats-action">
                <div className="feed-actions">
                  <AiOutlineLike onClick={() => setSelectedPost(post.id)} className="icon" title="Tip / Like" />
                  <span className="likes" title={`Liked by: ${post.likedBy.join(", ")}`}>{post.likes}</span>
                  <AiOutlineDislike className="icon" />
                  <AiOutlineMessage className="icon" />
                  <span>{post.comments}</span>
                </div>

                <div className="feed-stats">
                  <span>Post reward:</span>
                  <div>
                    <TbMoneybag className="icon" />
                    <span>₦{post.tippedAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <TipPopup
          balance={balance}
          onClose={() => setSelectedPost(null)}
          onTip={handleTip}
        />
      )}
    </div>
  );
}
