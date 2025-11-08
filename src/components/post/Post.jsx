import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AiOutlineLike,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMessage,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import TipPopup from "../tip-popup/TipPopup";
import { getPostById, addComment, tipComment } from "../../api/postApi";
import { LoadingSkeleton } from "../skeleton/LoadingSkeleton";
import "./index.css";
import HuminerPostSample from "../../assets/HuminerPostSample.jpeg"

export default function SinglePostPage() {
   const { activeUser } = useSelector((state) => state.huminer);

  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [showLikedBy, setShowLikedBy] = useState(false);
  const [showTipPopup, setShowTipPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipTarget, setTipTarget] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    getSinglePost();
  }, [postId]);

  const getSinglePost = async () => {
    try {
      setLoading(true);
      const response = await getPostById(postId);
      setPost(response.post);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openTipPopup = (target) => {
    setTipTarget(target);
    setShowTipPopup(true);
  };

  const handleTipSubmit = (amount) => {
    if (tipTarget?.type === "post") {
      console.log(`Tipped ₦${amount} to post ${tipTarget.id}`);
    }
    setShowTipPopup(false);
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      // setLoading(true);
      const response = await addComment(postId, { content: newCommentText });
      if (response.success) {
        setPost(response.post);
        setNewCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === filteredMedia.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? filteredMedia.length - 1 : prev - 1
    );
  };

  // 🖼 Filter media types
  const filteredMedia = post?.media?.filter(
    (m) => m.type === "image" || m.type === "video"
  ) || [];
  const audioMedia = post?.media?.filter((m) => m.type === "audio") || [];

  const renderMedia = (media) => {
    if (media.type === "image") {
      return media.url?  <img src={media.url} alt="post media" className="post-media" /> :
      <img src={HuminerPostSample} alt="" srcset="" />;
    } else if (media.type === "video") {
      return (
        <video
          src={media.url}
          controls
          className="post-media"
          poster={post?.media?.find((m) => m.type === "image")?.url}
        />
      );
    }
  };

  const hasTipped = post?.tips?.some(tip => tip.fromUserId === activeUser._id);

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <div className="single-post">
      {/* ✅ MEDIA SLIDER (only images & videos) */}
      {filteredMedia.length > 0 ? (
        <div className="media-slider">
          {renderMedia(filteredMedia[currentMediaIndex])}
          {filteredMedia.length > 1 && (
            <>
              <button className="nav-btn left" onClick={prevMedia}>
                <AiOutlineLeft />
              </button>
              <button className="nav-btn right" onClick={nextMedia}>
                <AiOutlineRight />
              </button>
            </>
          )}
        </div>
      ) : (
        // 🖼 Default fallback when no image/video
        <div className="media-slider">
          <img
            src={HuminerPostSample}
            alt="Default Post"
            className="post-media"
            style={{ objectFit: "cover", width: "100%", borderRadius: "12px" }}
          />
        </div>
      )}


      {/* 🎧 AUDIO SECTION */}
      {audioMedia.length > 0 && (
        <div className="audio-section">
          <h3>Audio Snippet</h3>
          {audioMedia.map((audio, index) => (
            <div key={index} className="audio-wrapper">
              <audio controls className="audio-player">
                <source src={audio.url} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          ))}
        </div>
      )}

      {/* 📝 POST CONTENT */}
      <h1>{post?.title}</h1>
      <p className="author">By {post?.author}</p>
      {/* <p className="content">{post?.body}</p> */}
      <div className="content">
        {post?.body?.split("\n").map((paragraph, idx) => (
          paragraph.trim() && <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <div className="post-stats">
      <div className="post-like-wrappe">
        {!hasTipped ? <div className="post-likes">
          <span>{post?.tips?.length || 0}</span>
          <AiOutlineLike
            className="icon"
            onClick={() => openTipPopup({ type: "post", id: post?._id })}
          />
        </div> :
        <div className="post-likes">
          <span>{post?.tips?.length || 0}</span>
          <BiSolidLike
            className="icon liked-icon"
            // onClick={() => openTipPopup({ type: "post", id: post?._id })}
          />
        </div>}
        {/* <div style={{ display: "flex", alignSelf: "center" }}>
          <button onClick={() => setShowLikedBy(!showLikedBy)}>
            {showLikedBy ? (
              <AiOutlineEyeInvisible className="icon" />
            ) : (
              <AiOutlineEye className="icon" />
            )}
          </button>
        </div> */}
      </div>
        {/* <span>❤️ {post?.tips?.length || 0} Likes</span> */}
        <span>💰 ₦{post?.totalTips || 0} Tipped</span>
        <span>💬 {post?.comments?.length || 0} Comments</span>
      </div>


      {/* 💬 COMMENTS SECTION */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {post?.comments?.length === 0 ? (
          <div className="no-comment">
            <AiOutlineMessage className="icon" />
            <p>No comments yet, start conversation.</p>
          </div>
        ) : (
          <CommentList comments={post.comments} postId={post._id}/>
        )}
      </div>

      {showTipPopup && (
        <TipPopup
          onClose={() => setShowTipPopup(false)}
          onTip={handleTipSubmit}
          postId={postId}
          type="post"
        />
      )}
    </div>
  );
}

function CommentList({ comments, postId }) {
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showTipPopup, setShowTipPopup] = useState(false);
  const [tipTarget, setTipTarget] = useState(null);

  const openTipPopup = (target) => {
    setTipTarget(target);
    setShowTipPopup(true);
  };

  const handleTipSubmit = async (amount) => {
    if (tipTarget?.type === "comment") {
      const { id: commentId } = tipTarget;
      const tipData = { amount, currency: "NGN" }; // or dynamic currency
      console.log(tipData)
      console.log("postid....", postId)
      const response = await tipComment(postId, commentId, tipData);

      if (response.success) {
        alert("Tipped successfully!");
        window.location.reload(); // reload to see updated tips
      }
    }
    setShowTipPopup(false);
  };

  return (
    <ul style={{ marginLeft: 20 }}>
      {comments?.map((comment) => (
        <li className="comment-item card" key={comment._id}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1RjPbiW0rp7uKIasNl4SdZuCiQpQFQDejQ&s"
            alt={comment.commentAuthor}
            className="comment-avatar"
          />
          <div className="comment-body">
            <strong>{comment.commentAuthor}</strong>
            <p>{comment.content}</p>

            <div className="comment-actions">
              <span>❤️ {comment.tips?.length || 0}</span>
              <span>💰 ₦{comment.totalTips || 0}</span>

              <button
                onClick={() =>
                  openTipPopup({ type: "comment", id: comment._id })
                }
              >
                Tip
              </button>

              <button
                onClick={() =>
                  setActiveReplyId(
                    activeReplyId === comment._id ? null : comment._id
                  )
                }
              >
                Reply
              </button>
            </div>

            {activeReplyId === comment._id && (
              <div className="reply-box">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={() => {
                    // handle reply here later
                    setReplyText("");
                    setActiveReplyId(null);
                  }}
                >
                  Submit
                </button>
              </div>
            )}

            {/* Nested replies */}
            {comment.children?.length > 0 && (
              <CommentList comments={comment.children} postId={postId} />
            )}
          </div>
        </li>
      ))}

      {showTipPopup && (
        <TipPopup
          onClose={() => setShowTipPopup(false)}
          onTip={handleTipSubmit}
          postId={postId}
          commentId={tipTarget?.id}
          type="comment"
        />
      )}
    </ul>
  );
}
