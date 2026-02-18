import React, { useState, useEffect, act } from "react";
import { Router, Routes, Route, useLocation } from "react-router-dom";
import * as jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfileThunk } from "./redux/userSlice";
import Navbar from "./components/nav/NavBar";
import HomePage from "./pages/home/Home";
import ProfilePage from "./pages/profile/Profile";
import ChallengesPage from "./pages/challenges/Challenges";
import CreatePostPage from "./pages/submit/Submit";
import LoginPage from "./pages/login/Login";
import SignupPage from "./pages/signup/Signup";
import FeedPage from "./pages/feeds/Feeds";
import SinglePostPage from "./components/post/Post";
import WalletPage from "./pages/wallet/Wallet";
import BadgeGenerator1 from "./pages/programCertification/BadgeGenerator";
import LinkTree from "./pages/link-tree/LinkTree";
import Sidebar from "./components/sidebar/SideBar";
import Suggestions from "./components/suggestions/Suggestions";
import SongPage from "./pages/song-page/SongPage";
import NotificationPage from "./components/notification/Notification";
import { fetchNotificationsThunk } from "./redux/notificationSlice";
import Chat from "./components/chat/Chat";
import { socket } from "./helpers/sockets";
// import getU
import "./App.css";

import BottomNav from "./components/nav/BottomNav";

function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { activeUser } = useSelector((state) => state.huminer);

  useEffect(() => {
    if (activeUser?._id) {
      dispatch(fetchNotificationsThunk(activeUser._id));
    }
  }, [activeUser, dispatch]);

  useEffect(() => {
    if (activeUser?._id) {
      // Notify backend that this user is online
      socket.emit("userOnline", activeUser._id);

      // Optionally, listen for updates about online users
      socket.on("updateOnlineUsers", (onlineIds) => {
        console.log("Currently online users:", onlineIds);
      });

      // Clean up on unmount
      return () => {
        socket.off("updateOnlineUsers");
      };
    }
  }, [activeUser]); // <-- remove the extra closing brace here

  const hideSideBarRoutes = ["/", "/login", "/signup"];
  const hideSuggestionBarRoutes = ["/", "/create", "/login", "/signup"];
  const hideBottomNavRoutes = ["/login", "/signup"]; // Hide bottom nav on auth pages

  const shouldHideSidebar = hideSideBarRoutes.includes(pathname);
  const shouldHideSuggestionbar = hideSuggestionBarRoutes.includes(pathname);
  const shouldHideBottomNav = hideBottomNavRoutes.includes(pathname);

  // Suggestions Toggle State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const toggleSuggestions = () => setShowSuggestions(!showSuggestions);

  return (
    <div className={shouldHideSidebar ? "" : "app-layout"}>
      {!shouldHideSidebar && (
        <Sidebar toggleSuggestions={toggleSuggestions} />
      )}
      <div className={shouldHideSidebar ? "" : "app-content"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/post/:postId" element={<SinglePostPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/badge" element={<BadgeGenerator1 />} />
          <Route path="/link-tree" element={<LinkTree />} />
          <Route path="/song/:id" element={<SongPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<Chat />} />
        </Routes>
      </div>
      {!shouldHideSuggestionbar && (
        <Suggestions
          showMobile={showSuggestions}
          closeMobile={() => setShowSuggestions(false)}
        />
      )}
      {!shouldHideBottomNav && (
        <BottomNav toggleSuggestions={toggleSuggestions} />
      )}
    </div>
  );
}


export default App;
