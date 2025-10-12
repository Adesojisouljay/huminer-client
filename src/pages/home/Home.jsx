import React from "react";
import "./index.css";

export default function LandingPage() {
  return (
    <div className="landing">

      {/* Hero Section */}
      <section className="hero">
        <h1>🎵 Share Your Music. Engage Your Fans. Get Tipped.</h1>
        <p>Join a vibrant community where artists and fans connect directly through music and tips.</p>
        <button className="cta-btn">Join Now</button>
      </section>

      <section className="celebrity-banner">
        <h2>🎤 Everyone is a Celebrity Here</h2>
        <p>
            Whether you’re an artist or a fan, your voice matters. 
            Share, support, and shine in a community built for mutual love of music.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          💰 <h3>Tip Artists</h3>
          <p>Support your favorite artists directly with instant tips in Naira.</p>
        </div>
        <div className="feature-card">
          🎯 <h3>Join Challenges</h3>
          <p>Participate in fun music challenges and win rewards.</p>
        </div>
        <div className="feature-card">
          🤝 <h3>Connect</h3>
          <p>Follow other artists and fans to grow your music network.</p>
        </div>
        <div className="feature-card">
          🎶 <h3>Share Music</h3>
          <p>Upload your songs and share them instantly with the world.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span>1️⃣</span>
            <h3>Join the Platform</h3>
            <p>Create your free account in seconds.</p>
          </div>
          <div className="step">
            <span>2️⃣</span>
            <h3>Upload Your Music</h3>
            <p>Share your songs with fans instantly.</p>
          </div>
          <div className="step">
            <span>3️⃣</span>
            <h3>Engage Your Audience</h3>
            <p>Follow, like, and tip others to grow your reach.</p>
          </div>
          <div className="step">
            <span>4️⃣</span>
            <h3>Earn Tips</h3>
            <p>Get rewarded directly from your fans.</p>
          </div>
        </div>
      </section>

      {/* Challenges Preview */}
      <section className="challenges-preview">
        <h2>🔥 Upcoming Challenges</h2>
        <div className="challenge-cards">
          <div className="challenge-card">
            <h3>Best Freestyle Contest</h3>
            <p>Show your freestyle skills and win ₦10,000.</p>
            <button className="cta-btn">Join Now</button>
          </div>
          <div className="challenge-card">
            <h3>Cover Song Challenge</h3>
            <p>Perform your favorite hit and earn fan tips.</p>
            <button className="cta-btn">Join Now</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Community Says</h2>
        <div className="testimonial-list">
          <blockquote>
            “I earned my first ₦5,000 from fans in just one week!”
            <cite>- DJ Gabson</cite>
          </blockquote>
          <blockquote>
            “This platform connects me directly with my audience.”
            <cite>- Dj Hophuray</cite>
          </blockquote>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Start sharing your music today</h2>
        <button className="cta-btn">Get Started</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MyMusic. All rights reserved.</p>
      </footer>

    </div>
  );
}
