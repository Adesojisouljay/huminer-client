// src/components/PostCard.js
import React, { useState } from "react";
import TipPopup from "../tip-popup/TipPopup";

export default function PostCard({ post, balance, setBalance }) {
  const [showPopup, setShowPopup] = useState(false);
  const [totalTips, setTotalTips] = useState(0);

  const handleTip = (amount) => {
    setBalance((prev) => prev - amount);
    setTotalTips((prev) => prev + amount);
  };

  return (
    <div style={styles.card}>
      <h4>{post.author}</h4>
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt="post" style={styles.image} />}
      <p>Tips: ₦{totalTips}</p>
      <button onClick={() => setShowPopup(true)}>Like & Tip</button>

      {showPopup && (
        <TipPopup
          balance={balance}
          onClose={() => setShowPopup(false)}
          onTip={handleTip}
        />
      )}
    </div>
  );
}

const styles = {
  card: { border: "1px solid #ddd", padding: "10px", margin: "10px", borderRadius: "8px" },
  image: { width: "100%", borderRadius: "8px", marginTop: "10px" }
};
