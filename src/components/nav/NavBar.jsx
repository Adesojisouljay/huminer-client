import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default function Navbar({ balance }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🎵 SOULJAY</div>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/feed" className="navbar-link">Feeds</Link>
        <Link to="/challenges" className="navbar-link">Challenges</Link>
        <Link to="/profile" className="navbar-link">Profile</Link>
        <Link to="/create" className="navbar-link">New post</Link>
        <Link to="/wallet" className="navbar-link">Wallet</Link>
      </div>

      <div className="navbar-balance">
        <Link to="/profile">
            <img
            className="user-avatar"
            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            alt=""
            />
        </Link>
        <span>Balance: ₦{balance}</span>
      </div>
    </nav>
  );
}
