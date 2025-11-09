import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { tipPost, tipComment } from "../../api/postApi"; // <-- import both
import "./index.css";

export default function TipPopup({ onClose, onTip, postId, commentId, type }) {
  const target = { type: "post" | "comment", postId, commentId }
  const [amount, setAmount] = useState("");
  const amounts = [100, 200, 500, 1000, 5000];

  const { activeUser } = useSelector((state) => state.huminer);

  const handleTip = async () => {
    if (!amount) {
      alert("Please select or enter an amount.");
      return;
    }
    if (amount > activeUser.accountBalance) {
      alert("Amount exceeds your balance!");
      return;
    }

    const tipData = {
      amount: Number(amount),
      currency: "NGN",
    };
    console.log(postId, type)

    try {
      let response;
      if (type === "post") {
        response = await tipPost(postId, tipData);
      } else if (type === "comment") {
        response = await tipComment(postId, target.commentId, tipData);
      }

      console.log("Tip successful:", response);
      onTip(amount);
      onClose();
    } catch (error) {
      console.error("Tip failed:", error);
      alert(error?.response?.data?.message || "Failed to send tip.");
    }
  };

  return (
    <div className="tip-popup">
      <div className="tip-content modal">
        <h2>💖 Send a Tip</h2>
        <p>Your balance: ₦{activeUser.accountBalance}</p>

        <div className="tip-options">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={amt === amount ? "active" : ""}
            >
              ₦{amt}
            </button>
          ))}
        </div>

        <div className="custom-tip">
          <input
            type="number"
            placeholder="Custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleTip}>Send Tip</button>
        </div>

        <AiOutlineClose className="close-btn" onClick={onClose} />
      </div>
    </div>
  );
}
