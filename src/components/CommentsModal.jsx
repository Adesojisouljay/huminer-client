import React, { useState } from "react";
import { useSelector } from "react-redux";
import { addComment } from "../api/postApi";
import "./commentsModal.css";

export default function CommentsModal({ show, onClose, post }) {
    const { activeUser } = useSelector((state) => state.huminer);
    const [comments, setComments] = useState(post?.comments || []);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!show || !post) return null;

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const res = await addComment(post._id, { content: newComment });
            if (res.success) {
                setComments(res.post.comments); // Update local comments
                setNewComment("");
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="comments-modal card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Comments ({comments.length})</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="comments-list">
                    {comments.length === 0 ? (
                        <p className="no-comments">No comments yet. Be the first!</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c._id} className="comment-item">
                                <strong>{c.commentAuthor}</strong>
                                <p>{c.content}</p>
                            </div>
                        ))
                    )}
                </div>

                <form className="comment-form" onSubmit={handleAddComment}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "..." : "Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}
