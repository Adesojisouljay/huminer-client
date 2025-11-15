import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaBell,
  FaPlusSquare,
  FaUser,
  FaWallet,
  FaEllipsisH,
} from "react-icons/fa";
import LogoutButton from "../logout/Logout";
import "./index.css";

const Sidebar = () => {

  const { activeUser } = useSelector((state) => state.huminer);
  const { notifications } = useSelector((state) => state.notifications);

  const unreadNotificationCount = notifications?.filter((n) => !n.read)?.length;

  const location = useLocation();

  const getActiveClass = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>HUMINER</h2>
      </div>

      <div className="avatar-container">
        <img
          className="user-avatar"
          src={activeUser?.profilePicture || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
          alt="user avatar"
        />
        <span>₦{activeUser?.accountBalance || 0}</span>
      </div>

      <h3>Hello, {activeUser?.username}</h3>

      <nav className="sidebar-nav">
        <Link to="/" className={getActiveClass("/")}>
          <FaHome /> Home
        </Link>

        <Link to="/feed" className={getActiveClass("/feed")}>
          <FaCompass /> Feed
        </Link>

        <Link to="/notification" className={getActiveClass("/notification")} style={{ position: "relative" }}>
          <FaBell /> Notifications
          {unreadNotificationCount > 0 && (
            <span className="notification-badge">{unreadNotificationCount}</span>
          )}
        </Link>

        <Link to="/create" className={getActiveClass("/create")}>
          <FaPlusSquare /> Create Post
        </Link>

        <Link to={`/profile/${activeUser.username}`} className={getActiveClass("/profile")}>
          <FaUser /> Profile
        </Link>

        <Link to="/wallet" className={getActiveClass("/wallet")}>
          <FaWallet /> Wallet
        </Link>
      </nav>

      <LogoutButton />

      <div className="sidebar-footer">
        <div className="profile">
          <div>
            <strong>Learn More</strong>
          </div>
        </div>
        <button className="more-btn">
          <FaEllipsisH />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
