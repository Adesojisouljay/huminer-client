import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserThunk } from "../../redux/userSlice"; // adjust path if needed
import "./index.css";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, activeUser } = useSelector((state) => state.huminer);

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { fullName, username, email, password };
    dispatch(registerUserThunk(userData));
  };

  // Redirect to login after successful registration
  useEffect(() => {
    if (!loading && activeUser) {
      alert("Registration successful! Please log in.");
      navigate("/login");
    }
  }, [loading, activeUser, navigate]);

  return (
    <div className="signup-page">
      <div className="auth-container">
        {/* Left Side: Hero Section */}
        <div className="auth-left">
          <div className="auth-hero-content">
            <h1>You are the <span className="highlight-text">resource</span>. Start <span className="highlight-text">mining</span> today.</h1>
            <p>Huminer: Discover the wealth within your creativity.</p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="auth-right">
          <div className="signup-box">
            <h1 className="mobile-logo">HUMINER</h1>
            <p className="signup-subtitle">
              Join the revolution of human mining
            </p>

            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="signup-links">
              <span>Already have an account?</span>
              <a href="/login">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
