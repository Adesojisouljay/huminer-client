import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { tipPost } from "../../api/postApi";
import "./index.css";

export default function TipPopup({ onClose, onTip, postId }) {
  const [amount, setAmount] = useState("");
  const amounts = [100, 200, 500, 1000, 5000];

  const { activeUser } = useSelector((state) => state.huminer);
  console.log(activeUser)

  const handleSubmit = (amount) => {
    if (amount > activeUser.accountBalance) {
      alert("Amount exceeds your balance!");
      return;
    }
    onTip(amount);
  };

  const tipUser = async () => {

    const tipData = {
      amount: Number(amount), 
      currency: "NGN"
    }

    console.log("object...")

    try {
      const tip = await tipPost(postId, tipData);
      console.log(tip)
    } catch (error) {
      console.log();
    }
  }

  return (
    <div className="tip-popup">
      <div className="tip-content modal">
        <h2>💖 Send a Tip</h2>
        <p>Your balance: ₦{activeUser.accountBalance}</p>

        <div className="tip-options">
          {amounts.map((amt) => (
            <button key={amt} onClick={() => handleSubmit(amt)}>
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
          <button onClick={() => tipUser()}>
            Tip Custom
          </button>
        </div>
       <AiOutlineClose className="close-btn" onClick={onClose} />

      </div>
    </div>
  );
}
