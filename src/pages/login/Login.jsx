import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUserThunk } from "../../redux/userSlice";
import "./index.css";

export default function LoginPage() {
  const [emailOrUsername, setemailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, activeUser } = useSelector(
    (state) => state.huminer
  );

  const handleLogin = (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      alert("Please fill in all fields.");
      return;
    }
    console.log("object")
    // Dispatch the login thunk
    dispatch(loginUserThunk({ emailOrUsername, password }));
  };

  // Redirect when logged in
  useEffect(() => {
    if (isAuthenticated && activeUser) {
      console.log("User logged in:", activeUser);
      navigate("/feed"); // redirect to homepage or dashboard
    }
  }, [isAuthenticated, activeUser, navigate]);

  return (
    <div className="login-page">
      <div className="auth-container">
        {/* Left Side: Hero Section */}
        <div className="auth-left">
          <div className="auth-hero-content">
            <h1>Mine your <span className="highlight-text">creativity</span>. Unearth your <span className="highlight-text">worth</span>.</h1>
            <p>Welcome to Huminer. Where everyone is a celebrity and every interaction is valuable.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="auth-right">
          <div className="login-box">
            <h1 className="mobile-logo">HUMINER</h1>
            <p className="login-subtitle">Log in to start mining your potential</p>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Email address"
                value={emailOrUsername}
                onChange={(e) => setemailOrUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="login-links">
              <a href="/signup">Create an account</a>
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
