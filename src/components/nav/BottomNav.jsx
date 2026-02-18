import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaCompass,
  FaPlusSquare,
  FaBell,
  FaUser,
  FaBars,
  FaWallet,
  FaFacebookMessenger,
  FaSignOutAlt,
  FaUsers
} from "react-icons/fa";
import LogoutButton from "../logout/Logout";
import "./BottomNav.css";

const BottomNav = ({ toggleSuggestions }) => {
  const { activeUser } = useSelector((state) => state.huminer);
  const { notifications } = useSelector((state) => state.notifications);
  const unreadNotificationCount = notifications?.filter((n) => !n.read)?.length;
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const getActiveClass = (path) => (location.pathname === path ? "active" : "");

  return (
    <>
      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="bottom-nav-menu">
          <Link to="/chat" className="menu-item" onClick={() => setShowMenu(false)}>
            <FaFacebookMessenger /> Chat
          </Link>
          <Link to="/wallet" className="menu-item" onClick={() => setShowMenu(false)}>
            <FaWallet /> Wallet
          </Link>
          <Link to={`/profile/${activeUser?.username}`} className="menu-item" onClick={() => setShowMenu(false)}>
            <FaUser /> Profile
          </Link>
          <div className="menu-item" onClick={() => { toggleSuggestions(); setShowMenu(false); }}>
            <FaUsers /> People
          </div>
          <div className="menu-item logout-container">
            <LogoutButton />
          </div>
        </div>
      )}

      {/* Overlay backdrop to close menu */}
      {showMenu && <div className="menu-backdrop" onClick={() => setShowMenu(false)} />}

      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${getActiveClass("/")}`}>
          <FaHome />
          <span>Home</span>
        </Link>

        <Link to="/feed" className={`nav-item ${getActiveClass("/feed")}`}>
          <FaCompass />
          <span>Feed</span>
        </Link>

        <Link to="/create" className={`nav-item ${getActiveClass("/create")}`}>
          <FaPlusSquare />
          <span>Post</span>
        </Link>

        <Link to="/notification" className={`nav-item ${getActiveClass("/notification")}`}>
          <div style={{ position: "relative" }}>
            <FaBell />
            {unreadNotificationCount > 0 && (
              <span className="bottom-nav-badge">{unreadNotificationCount}</span>
            )}
          </div>
          <span>Alerts</span>
        </Link>

        <button className={`nav-item ${showMenu ? "active" : ""}`} onClick={() => setShowMenu(!showMenu)}>
          <FaBars />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;
