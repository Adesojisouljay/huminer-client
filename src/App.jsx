import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import "./App.css"

function App() {
  const [balance, setBalance] = useState(500); // Mock balance

  return (
    <Router>
      <Navbar balance={balance} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create" element={<CreatePostPage />}/>
        <Route path="/create" element={<CreatePostPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/post/:id" element={<SinglePostPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/badge" element={<BadgeGenerator1 />} />
        <Route path="/link-tree" element={<LinkTree />} />

      </Routes>
    </Router>
  );
}

export default App;
