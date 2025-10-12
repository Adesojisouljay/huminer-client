import React from "react";
import "./index.css";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    avatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    bio: "Musician, producer, and lover of beats. Here to connect with fans and share my journey.",
    balance: 750,
    followers: 1280,
    following: 340,
    posts: [
      { id: 1, content: "Just dropped a new track today!", image: "https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1" },
      { id: 2, content: "Behind-the-scenes of my music video shoot 🎬", image: "https://new.boredteachers.com/wp-content/uploads/2025/04/Music-facts-cover-scaled.jpg" },
      { id: 3, content: "Just dropped a new track today!", image: "https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1" },
      { id: 4, content: "Behind-the-scenes of my music video shoot 🎬", image: "https://new.boredteachers.com/wp-content/uploads/2025/04/Music-facts-cover-scaled.jpg" },
      { id: 5, content: "Just dropped a new track today!", image: "https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1" },
      { id: 6, content: "Behind-the-scenes of my music video shoot 🎬", image: "https://new.boredteachers.com/wp-content/uploads/2025/04/Music-facts-cover-scaled.jpg" },
      { id: 7, content: "Just dropped a new track today!", image: "https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1" },
      { id: 8, content: "Behind-the-scenes of my music video shoot 🎬", image: "https://new.boredteachers.com/wp-content/uploads/2025/04/Music-facts-cover-scaled.jpg" },
      { id: 9, content: "Just dropped a new track today!", image: "https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1" },
      { id: 10, content: "Behind-the-scenes of my music video shoot 🎬", image: "https://new.boredteachers.com/wp-content/uploads/2025/04/Music-facts-cover-scaled.jpg" },
      { id: 11, content: "Just dropped a new track today!", image: "https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1" },
      { id: 612, content: "Behind-the-scenes of my music video shoot 🎬", image: "https://new.boredteachers.com/wp-content/uploads/2025/04/Music-facts-cover-scaled.jpg" }
    ]
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img className="profile-avatar" src={user.avatar} alt={user.name} />
        <div>
          <h1>{user.name}</h1>
          <p>{user.bio}</p>

          <div className="profile-stats">
            <span><strong>{user.followers}</strong> Followers</span>
            <span><strong>{user.following}</strong> Following</span>
          </div>

          <span className="profile-balance">Balance: ₦{user.balance}</span>
        </div>
      </div>

      <h2>Posts</h2>
      <div className="profile-posts">
        {user.posts.map(post => (
          <div key={post.id} className="profile-post card">
            <img src={post.image} alt="Post" />
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
