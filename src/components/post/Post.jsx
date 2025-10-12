import React, { useState } from "react";
import { AiOutlineLike, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import TipPopup from "../tip-popup/TipPopup";
import "./index.css";

export default function SinglePostPage() {
  const post = {
    id: 1,
    author: "Soji",
    title: "Check out my new song!",
    content:
      "I just released a fresh track and I’m so excited to share it with you guys! 🎶🔥",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1RjPbiW0rp7uKIasNl4SdZuCiQpQFQDejQ&s",
    likes: 5,
    tippedAmount: 800,
    comments: 3,
    likedBy: ["Jane", "Mike", "Ada", "Kola", "Tosin"],
  };

  const [showLikedBy, setShowLikedBy] = useState(false);
  const [showTipPopup, setShowTipPopup] = useState(false);
  const [tipTarget, setTipTarget] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Jane",
      avatar: "https://i.pravatar.cc/40?img=1",
      text: "This is 🔥🔥🔥",
      likes: 3,
      tippedAmount: 200,
      children: [
        {
          id: 4,
          author: "Mike",
          avatar: "https://i.pravatar.cc/40?img=2",
          text: "Totally agree! 🔥",
          likes: 1,
          tippedAmount: 50,
          children: [],
        },
      ],
    },
    {
      id: 2,
      author: "Mike",
      avatar: "https://i.pravatar.cc/40?img=2",
      text: "Love your vibe!",
      likes: 2,
      tippedAmount: 500,
      children: [],
    },
  ]);

  const [newCommentText, setNewCommentText] = useState("");

  const openTipPopup = (target) => {
    setTipTarget(target);
    setShowTipPopup(true);
  };

  const handleTipSubmit = (amount) => {
    if (tipTarget.type === "post") {
      console.log(`Tipped ₦${amount} to post ${tipTarget.id}`);
    } else if (tipTarget.type === "comment") {
      handleCommentTip(tipTarget.id, amount);
    }
    setShowTipPopup(false);
  };

  const handleCommentTip = (commentId, amount) => {
    const tipRecursively = (arr) =>
      arr.map((c) =>
        c.id === commentId
          ? { ...c, tippedAmount: c.tippedAmount + amount }
          : { ...c, children: tipRecursively(c.children) }
      );
    setComments(tipRecursively(comments));
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "You",
      avatar: "https://i.pravatar.cc/40?u=new",
      text: newCommentText,
      likes: 0,
      tippedAmount: 0,
      children: [],
    };
    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const handleAddReply = (parentId, replyText) => {
    if (!replyText.trim()) return;
    const addReplyRecursively = (arr) =>
      arr.map((c) =>
        c.id === parentId
          ? {
              ...c,
              children: [
                ...c.children,
                {
                  id: Date.now(),
                  author: "You",
                  avatar: "https://i.pravatar.cc/40?u=reply",
                  text: replyText,
                  likes: 0,
                  tippedAmount: 0,
                  children: [],
                },
              ],
            }
          : { ...c, children: addReplyRecursively(c.children) }
      );
    setComments(addReplyRecursively(comments));
  };

  return (
    <div className="single-post">
      <img src={post.image} alt={post.title} className="post-image" />
      <h1>{post.title}</h1>
      <p className="author">By {post.author}</p>
      <p className="content">{post.content}</p>

      <div className="post-stats">
        <span>❤️ {post.likes} Likes</span>
        <span>💰 ₦{post.tippedAmount} Tipped</span>
        <span>💬 {post.comments} Comments</span>
      </div>

      <div className="post-like-wrapper">
        <div className="post-likes">
          <AiOutlineLike
            className="icon"
            onClick={() => openTipPopup({ type: "post", id: post.id })}
          />
          <span>3.4k</span>
        </div>
        <div style={{ display: "flex", alignSelf: "center" }}>
          <button onClick={() => setShowLikedBy(!showLikedBy)}>
            {showLikedBy ? <AiOutlineEyeInvisible className="icon" /> : <AiOutlineEye className="icon" />}
          </button>
        </div>
      </div>

      {showLikedBy && (
        <ul className="liked-by-list card">
          {post.likedBy.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      )}

      {/* Add comment form */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>

      {/* Comments */}
      <div className="comments-section">
        <h3>Comments</h3>
        <CommentList comments={comments} onOpenTipPopup={openTipPopup} onAddReply={handleAddReply} />
      </div>

      {showTipPopup && (
        <TipPopup
          balance={2000}
          onClose={() => setShowTipPopup(false)}
          onTip={handleTipSubmit}
        />
      )}
    </div>
  );
}

function CommentList({ comments, onOpenTipPopup, onAddReply, level = 0 }) {
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  return (
    <ul style={{ marginLeft: level * 20 }}>
      {comments.map((comment) => (
        <li className="comment-item card" key={comment.id}>
          <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
          <div className="comment-body">
            <strong>{comment.author}</strong>
            <p>{comment.text}</p>
            <div className="comment-actions">
              <span>❤️ {comment.likes}</span>
              <span>💰 ₦{comment.tippedAmount}</span>
              <button onClick={() => onOpenTipPopup({ type: "comment", id: comment.id })}>Tip</button>
              <button onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}>
                Reply
              </button>
            </div>

            {activeReplyId === comment.id && (
              <div className="reply-box">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={() => {
                    onAddReply(comment.id, replyText);
                    setReplyText("");
                    setActiveReplyId(null);
                  }}
                >
                  Submit
                </button>
              </div>
            )}

            {comment.children?.length > 0 && (
              <CommentList
                comments={comment.children}
                onOpenTipPopup={onOpenTipPopup}
                onAddReply={onAddReply}
                level={level + 1}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
