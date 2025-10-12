import React, { useState } from "react";
import "./index.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    console.log("Logging in with:", { email, password });
    alert("Login successful (mock)!");
    // Later: call backend API for authentication
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>🎵 SOULJAY</h1>
        <p className="login-subtitle">Log in to connect with fans and artists</p>

        <form onSubmit={handleLogin}>
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

          <button type="submit">Login</button>
        </form>

        <div className="login-links">
          <a href="/signup">Create an account</a>
          <a href="/forgot-password">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}
