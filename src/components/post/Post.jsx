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
  const [commenting, setCommenting] = useState(false)

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
      setCommenting(true);
      const response = await addComment(postId, { content: newCommentText });
      if (response.success) {
        setPost(response.post);
        setNewCommentText("");
        setCommenting(false)
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
      setCommenting(false)
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
        <button
          disabled={commenting}
          onClick={handleAddComment}
          >
          {commenting ? "Replying..." : "Send reply"}
        </button>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {post?.comments?.length === 0 ? (
          <div className="no-comment">
            <AiOutlineMessage className="icon" />
            <p>No comments yet, start conversation.</p>
          </div>
        ) : (
          <CommentList comments={post.comments} postId={post._id} setPost={setPost}/>
        )}
      </div>

      {showTipPopup && (
        <TipPopup
          onClose={() => setShowTipPopup(false)}
          onTip={handleTipSubmit}
          postId={postId}
          type="post"
          setPost={setPost}
        />
      )}
    </div>
  );
}

function CommentList({ comments, postId, setPost }) {
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showTipPopup, setShowTipPopup] = useState(false);
  const [tipTarget, setTipTarget] = useState(null);
  const [replying, setReplying] = useState(false)

  const openTipPopup = (target) => {
    setTipTarget(target);
    setShowTipPopup(true);
  };

  const handleTipSubmit = async (amount) => {
    setShowTipPopup(false);
  };

  // submit reply to either main comment OR reply
  const submitReply = async (targetComment) => {
    if (!replyText.trim()) return;
    setReplying(true)

    const payload = {
      content: replyText,
      replyTo: targetComment._id,
    };

    const res = await addComment(postId, payload);
    console.log(res)

    
    if (res.success) {
      setReplyText("");
      setActiveReplyId(null);
      setPost(res.post);
      setReplying(false)
      // window.location.reload();
    }
  };

  return (
    <ul style={{ marginLeft: 10 }}>
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
                  setActiveReplyId(activeReplyId === comment._id ? null : comment._id)
                }
              >
                Reply
              </button>
            </div>

            {/* Reply input (for both comment + replies) */}
            {activeReplyId === comment._id && (
              <div className="reply-box">
                <input
                  type="text"
                  placeholder={`Replying...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button className="cancel-btn" onClick={() => setActiveReplyId(null)}>
                  cancel
                </button>
                <button onClick={() => submitReply({ _id: activeReplyId })}>
                {replying ? "Sending Replying" : "Send reply"}
                </button>
              </div>
            )}

            {/* ONE LEVEL CHILDREN */}
            {comment.children?.length > 0 && (
              <ul className="reply-list">
                {comment.children.map((child) => (
                  <li className="reply-item" key={child._id}>
                    <div className="reply-body">
                      <strong>{child.commentAuthor}</strong>

                      <p>
                        <span className="reply-tag">@{child.parentAuthor}</span>{" "}
                        {child.content}
                      </p>

                      <div className="reply-actions">
                        <span>❤️ {child.tips?.length || 0}</span>
                        <span>💰 ₦{child.totalTips || 0}</span>

                        <button
                          onClick={() =>
                            openTipPopup({
                              type: "comment",
                              id: child._id,
                            })
                          }
                        >
                          Tip
                        </button>

                        {/* 🔥 REPLY TO REPLY BUTTON */}
                        <button
                          onClick={() =>
                            setActiveReplyId(
                              activeReplyId === comment._id
                                ? null
                                : child._id // reply to this child
                            )
                          }
                        >
                          Reply
                        </button>
                      </div>

                      {/* Input box appears under MAIN comment but targets child */}
                      {activeReplyId === child._id && (
                        <div className="reply-box">
                          <input
                            type="text"
                            placeholder={`Replying to @${child.commentAuthor}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button className="cancel-btn" onClick={() => setActiveReplyId(null)}>
                            cancel
                          </button>
                          <button onClick={() => submitReply(child)}>
                          {replying ? "Replying..." : "Send reply"}
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
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
          setPost={setPost}
        />
      )}
    </ul>
  );
}

