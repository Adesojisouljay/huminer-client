import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./index.css";

export default function TipPopup({ balance, onClose, onTip }) {
  const [customAmount, setCustomAmount] = useState("");
  const amounts = [100, 200, 500, 1000, 5000];

  const handleSubmit = (amount) => {
    if (amount > balance) {
      alert("Amount exceeds your balance!");
      return;
    }
    onTip(amount);
  };

  return (
    <div className="tip-popup">
      <div className="tip-content modal">
        <h2>💖 Send a Tip</h2>
        <p>Your balance: ₦{balance}</p>

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
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <button onClick={() => handleSubmit(Number(customAmount))}>
            Tip Custom
          </button>
        </div>
       <AiOutlineClose className="close-btn" onClick={onClose} />

      </div>
    </div>
  );
}
