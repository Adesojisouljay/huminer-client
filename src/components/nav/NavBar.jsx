import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "../logout/Logout";
import "./index.css";

export default function Navbar({ balance }) {
  const { activeUser } = useSelector((state) => state.huminer);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🎵 HUMINER</div>

      <div className="navbar-balance">
        <div
          className="avatar-container"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            className="user-avatar"
            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            alt="user avatar"
          />
          <span>₦{activeUser?.accountBalance || 0}</span>

          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/" className="dropdown-item">Home</Link>
              <Link to="/feed" className="dropdown-item">Feeds</Link>
              <Link to="/challenges" className="dropdown-item">Challenges</Link>
              <Link to="/create" className="dropdown-item">New Post</Link>
              <Link to="/wallet" className="dropdown-item">Wallet</Link>
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
