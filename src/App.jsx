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
import "./App.css";

function App() {

  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { activeUser } = useSelector((state) => state.huminer);
  console.log(activeUser?._id)

  // useEffect(() => {
  //   const token = localStorage.getItem("huminerToken");
  //   if (token && activeUser) {
  //     try {
  //       // const decoded = jwtDecode(token);
  //       // const userId = decoded?.id || decoded?.userId;
  //       // console.log("userId...", decoded)
  //       // if (userId) {
  //         // dispatch(fetchUserProfileThunk(activeUser?._id));
  //       // }
  //     } catch (e) {
  //       console.error("Invalid token", e);
  //     }
  //   }
  // }, []);


  const hideSideBarRoutes = ["/", "/login", "/signup"]
  const hideSuggestionBarRoutes = ["/", "/create", "/login", "/signup"]
  const shouldHideSidebar = hideSideBarRoutes.includes(pathname);
  const shouldHideSuggestionbar = hideSuggestionBarRoutes.includes(pathname);
  console.log(hideSideBarRoutes.includes(pathname))
  return (
    // <Router>
      <div className={shouldHideSidebar ? "" : "app-layout"}>
        {/* Sidebar on the left */}
        {!shouldHideSidebar && (
          <div>
            <Sidebar />
          </div>
        )}

        {/* Main content area */}
        {/* <div className="app-main"> */}
          {/* <Navbar balance={balance} /> */}

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
            </Routes>
          </div>
        {/* </div> */}
        {/* Right Suggestions Panel */}
        {!shouldHideSuggestionbar &&<div>
          <Suggestions />
        </div>}
      </div>
    // </Router>
  );
}

export default App;
