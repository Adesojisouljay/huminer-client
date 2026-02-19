import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { TbMoneybag } from "react-icons/tb";
import { LoadingSkeleton } from "../../components/skeleton/LoadingSkeleton";
import TipPopup from "../../components/tip-popup/TipPopup";
import { getAllPosts, getFollowingPosts, likePost } from "../../api/postApi";
import CommentsModal from "../../components/CommentsModal";
import HuminerPostSample from "../../assets/HuminerPostSample.jpeg";
import { getDaysUntilPayout, formatTimeAgo } from "../../helpers";
import "./index.css";

export default function FeedPage() {

  const { activeUser } = useSelector((state) => state.huminer);

  const [balance, setBalance] = useState(5000);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterType, setFilterType] = useState("latest");
  const [allPosts, setAllPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({});
  const touchStartX = useRef({});
  const touchEndX = useRef({});
  const [loading, setLoading] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [targetPost, setTargetPost] = useState(null);

  useEffect(() => {
    getPosts();
  }, [filterType]); // 🟢 Re-fetch when filter changes

  const getPosts = async () => {
    setLoading(true);
    try {
      let result;
      if (filterType === "following") {
        result = await getFollowingPosts();
      } else {
        result = await getAllPosts();
      }

      console.log(result)
      setAllPosts(result?.posts || []);
      const init = {};
      (result?.posts || []).forEach(p => (init[p._id] = 0));
      setCurrentSlide(init);
    } catch (error) {
      console.error(error);
      setAllPosts([]); // clear posts on error
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      // Optimistic update
      setAllPosts(prev => prev.map(p => {
        if (p._id === postId) {
          // Check if already liked using string comparison
          const isLiked = p.likes.some(id => id.toString() === activeUser._id.toString());

          return {
            ...p,
            likes: isLiked
              ? p.likes.filter(id => id.toString() !== activeUser._id.toString())
              : [...p.likes, activeUser._id]
          };
        }
        return p;
      }));

      await likePost(postId);
    } catch (error) {
      console.error("Like failed", error);
      getPosts(); // Revert on error
    }
  };

  const openComments = (post) => {
    setTargetPost(post);
    setShowCommentsModal(true);
  };

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

  const handleCommentUpdate = (postId, updatedComments) => {
    setAllPosts(prev => prev.map(p =>
      p._id === postId ? { ...p, comments: updatedComments } : p
    ));
  };

  return (
    <div className="feed-page">
      {/* Filter bar */}
      <div className="filter-bar">
        {["latest", "following", "artists", "challenges"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={filterType === f ? "active" : ""}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* <StoryViewer/> */}

      {/* Feed list */}
      <div className="feed-list">
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          allPosts?.length === 0 ? (
            <p className="no-posts">No posts to show.</p>
          ) : (
            allPosts?.map((post) => {
              const visualMedia = post.media?.filter(m => m.type === "image" || m.type === "video") || [];
              const audioMedia = post.media?.find(m => m.type === "audio");
              const total = visualMedia.length;
              const index = currentSlide[post._id] ?? 0;
              const hasTipped = post.tips.some(tip => tip.fromUserId === activeUser._id);

              return (
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
                      <span>({formatTimeAgo(post.createdAt)})</span>
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
                        <span
                          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                          onClick={() => handleLike(post._id)}
                        >
                          {post.likes?.some(id => id.toString() === activeUser?._id.toString()) ||
                            post.tips?.some(tip => tip.fromUserId.toString() === activeUser?._id.toString()) ? (
                            <BiSolidLike className="icon liked-icon" color="#FFD700" />
                          ) : (
                            <AiOutlineLike className="icon" />
                          )}
                          <span style={{ color: "white", fontSize: "14px" }}>{post.likes?.length|| post.tips?.length || 0}</span>
                        </span>

                        <span
                          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                          onClick={() => openComments(post)}
                        >
                          <AiOutlineMessage className="icon" />
                          <span style={{ color: "white", fontSize: "14px" }}>{post?.comments?.length ?? 0}</span>
                        </span>

                        <span
                          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                          onClick={() => setSelectedPost(post._id)}
                          title="Tip this post"
                        >
                          <TbMoneybag className="icon" />
                          <span style={{ color: "white", fontSize: "14px" }}>{post.tips?.length || 0}</span>
                        </span>
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
              );
            })
          ))}
      </div>

      {selectedPost && (
        <TipPopup
          onClose={() => setSelectedPost(null)}
          onTip={handleTip}
          postId={selectedPost}
          type="post"
        />
      )}

      {showCommentsModal && (
        <CommentsModal
          show={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          post={targetPost}
          onCommentAdded={handleCommentUpdate}
        />
      )}
    </div>
  );
}
