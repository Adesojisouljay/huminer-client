import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaCompass,
  FaEnvelope,
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
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>HUMINER</h2>
      </div>
      <div className="avatar-container">
        <img
            className="user-avatar"
            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            alt="user avatar"
            />
          <span>₦{activeUser?.accountBalance || 0}</span>
      </div>
        <h3>Hello, {activeUser?.username}</h3>

      <nav className="sidebar-nav">
        <Link to="/" className="active"><FaHome /> Home</Link>
        {/* <Link to="/"><FaSearch /> Search</Link> */}
        <Link to="/"><FaCompass /> Explore</Link>
        <Link to="/feed"><FaCompass /> Feed</Link>
        <Link to="/"><FaEnvelope /> Messages</Link>
        <Link to="/notification"><FaBell /> Notifications</Link>
        <Link to="/create"><FaPlusSquare /> Create Post</Link>
        <Link to="/profile"><FaUser /> Profile</Link>
        <Link to="/wallet"><FaWallet /> Wallet</Link>
      </nav>

        <LogoutButton/>

      <div className="sidebar-footer">
        <div className="profile">
          {/* <img src="/images/adesoji-profile.jpg" alt="Adesoji Souljay" /> */}
          <div>
            <strong>Learn More</strong>
            {/* <span>Profile</span> */}
          </div>
        </div>
        <button className="more-btn"><FaEllipsisH /></button>
      </div>
    </aside>
  );
};

export default Sidebar;
