import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { TbMoneybag } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import FollowListModal from "./FollowListModal";
import { Link } from "react-router-dom";
import UpdateProfileModal from "./Modal";
import HuminerPostSample from "../../assets/HuminerPostSample.jpeg";
import { getDaysUntilPayout } from "../../helpers";
import { getPostByUsername } from "../../api/postApi";
import { getUserByUsername } from "../../api/userApi";
import TipPopup from "../../components/tip-popup/TipPopup";
import "./index.css";

export default function ProfilePage() {

  const params = useParams();

  const { activeUser } = useSelector((state) => state.huminer);
  const [showModal, setShowModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followType, setFollowType] = useState("followers"); // "followers" or "following"
  const [posts, setPosts] = useState()

  const [balance, setBalance] = useState(5000);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterType, setFilterType] = useState("latest");
  const [allPosts, setAllPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({});
  const touchStartX = useRef({});
  const touchEndX = useRef({});

  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getUserByUsername(params.username);
        setProfileUser(user);
  
        const userPosts = await getPostByUsername(params.username);
        setPosts(userPosts);
      } catch (e) {
        console.error("Error loading profile:", e);
      }
    }
  
    loadData();
  }, [params.username]);  

  const nextSlide = (postId, total) => {
    if (!total || total <= 1) return;
    setCurrentSlide(prev => {
      const cur = prev[postId] ?? 0;
      return { ...prev, [postId]: (cur + 1) % total };
    });
  };

  const prevSlide = (postId, total) => {
    if (!total || total <= 1) return;
    setCurrentSlide(prev => {
      const cur = prev[postId] ?? 0;
      return { ...prev, [postId]: (cur - 1 + total) % total };
    });
  };

  const handleTouchStart = (e, postId) => {
    touchStartX.current[postId] = e.touches[0].clientX;
  };

  const handleTouchEnd = (e, postId, total) => {
    touchEndX.current[postId] = e.changedTouches[0].clientX;
    const start = touchStartX.current[postId];
    const end = touchEndX.current[postId];
    if (start == null || end == null) return;
    const diff = start - end;
    const threshold = 50;
    if (diff > threshold) nextSlide(postId, total);
    else if (diff < -threshold) prevSlide(postId, total);
    touchStartX.current[postId] = null;
    touchEndX.current[postId] = null;
  };

  const handleTip = (amount) => {
    if (amount > balance) {
      alert("You don't have enough balance!");
      return;
    }
    setBalance(b => b - amount);
    setSelectedPost(null);
  };

  const isMypage = activeUser?.username === profileUser?.username

  return (
    <div className="profile-page">

      {/* --- UPDATE PROFILE BUTTON --- */}
      {isMypage && 
        <button className="update-profile-btn" onClick={() => setShowModal(true)}>
          Update Profile
        </button>}

      <div className="profile-header">
        <img 
          className="profile-avatar" 
          src={profileUser?.profilePicture || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} 
        />
        <div>
          <h1>{profileUser?.username}</h1>
          <p>{profileUser?.bio}</p>

          <div className="profile-stats">
            <span 
              className="clickable" 
              onClick={() => { setFollowType("followers"); setShowFollowModal(true); }}
            >
              <strong>{profileUser?.followers.length}</strong> Followers
            </span>

            <span 
              className="clickable"
              onClick={() => { setFollowType("following"); setShowFollowModal(true); }}
            >
              <strong>{profileUser?.following.length}</strong> Following
            </span>
          </div>

          {isMypage && <span className="profile-balance">Balance: ₦{profileUser?.accountBalance}</span>}
        </div>
      </div>

      <h2>Posts</h2>
      <div className="profile-posts">
        {posts?.map(post => {
         const visualMedia = post.media?.filter(m => m.type === "image" || m.type === "video") || [];
         const audioMedia = post.media?.find(m => m.type === "audio");
         const total = visualMedia.length;
         const index = currentSlide[post._id] ?? 0;
         const hasTipped = post.tips.some(tip => tip.fromUserId === activeUser._id);
         return  (
          <div className="feed-card" key={post._id}>
              {/* Show media slider or fallback image */}
              {total > 0 ? (
                <div
                  className="slider-container"
                  onTouchStart={(e) => handleTouchStart(e, post._id)}
                  onTouchEnd={(e) => handleTouchEnd(e, post._id, total)}
                >
                  <div
                    className="slider"
                    style={{
                      transform: `translateX(-${index * 100}%)`,
                      width: `${total * 100}%`
                    }}
                  >
                    {visualMedia.map((m, i) => (
                      <div className="slide" key={i}>
                        {m.type === "image" ? (
                          <img src={m.url} alt={`media-${i}`} loading="lazy" />
                        ) : (
                          <video controls src={m.url} />
                        )}
                      </div>
                    ))}
                  </div>

                  {total > 1 && (
                    <>
                      <button className="slider-btn prev" onClick={() => prevSlide(post._id, total)}>‹</button>
                      <button className="slider-btn next" onClick={() => nextSlide(post._id, total)}>›</button>
                      <div className="slider-indicators">
                        {visualMedia.map((_, i) => (
                          <button
                            key={i}
                            className={`dot ${i === index ? "active" : ""}`}
                            onClick={() => setCurrentSlide(prev => ({ ...prev, [post._id]: i }))}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // fallback image if no image/video
                <div className="fallback-image-container">
                  <img src={HuminerPostSample} alt="default post" className="fallback-image" />
                </div>
              )}

              {/* Post content */}
              <div className="feed-content">
                <Link className="feed-title" to={`/post/${post._id}`}>
                  <h2>{post.title}</h2>
                </Link>
                <p className="feed-author">By {post.author}</p>
                <p className="feed-snippet">
                  {post.body?.length > 120 ? post.body.substring(0, 120) + "..." : post.body}
                </p>

                {/* Audio */}
                {audioMedia && (
                  <audio controls src={audioMedia.url} style={{ width: "100%", marginTop: 10 }}>
                    Your browser does not support audio.
                  </audio>
                )}

                <div className="feed-stats-action">
                  <div className="feed-actions">
                    <span>{post.tips?.length}</span>
                    {!hasTipped ? <AiOutlineLike
                      onClick={() => setSelectedPost(post._id)}
                      className="icon"
                      title="Tip / Like"
                    /> : <BiSolidLike
                      // onClick={() => setSelectedPost(post._id)}
                        className="icon liked-icon"
                        title="Tip / Like"
                     />}
                    {/* <span className="likes">{post?.likes ?? 0}</span> */}
                    {/* <AiOutlineDislike className="icon" /> */}
                    <span>{post?.comments?.length ?? 0}</span>
                    <AiOutlineMessage className="icon" />
                  </div>

                  <div className="feed-stats">
                    {/* <span>Post reward:</span> */}
                    <div className="payout-info">
                      {/* <TbMoneybag className="icon" /> */}
                      <span><span>Post reward:</span><TbMoneybag className="icon" /> ₦{post?.totalTips ?? 0}</span>
                      <span>{getDaysUntilPayout(post?.payoutAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )})}
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <UpdateProfileModal 
          activeUser={activeUser}
          closeModal={() => setShowModal(false)}
        />
      )}

      {showFollowModal && profileUser && (
        <FollowListModal
          title={followType === "followers" ? "Followers" : "Following"}
          users={
            followType === "followers"
              ? profileUser.followers.map(u => u._id)
              : profileUser.following.map(u => u._id)
          }
          closeModal={() => setShowFollowModal(false)}
        />
      )}

      {selectedPost && (
        <TipPopup
          onClose={() => setSelectedPost(null)}
          onTip={handleTip}
          postId={selectedPost}
          type="post"
        />
      )}
    </div>
  );
}
