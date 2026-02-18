import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

export default function LandingPage() {
  const navigate = useNavigate();
  // protect against undefined state slice
  const { isAuthenticated, activeUser } = useSelector((s) => s.huminer ?? {});

  // include dependencies so the redirect runs correctly and avoids lint warnings
  useEffect(() => {
    if (isAuthenticated && activeUser) {
      navigate("/feed");
    }
  }, [isAuthenticated, activeUser, navigate]);

  return (
    <div className="landing">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="MyMusic home">MyMusic</Link>
          <nav className="nav" aria-label="Primary">
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/signup" className="nav-cta" role="button">Sign up</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1 id="hero-title">Share your music. Engage your fans. Get tipped.</h1>
              <p className="hero-sub">
                Join a vibrant community where artists and fans connect directly through music and tips.
              </p>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary" role="button" aria-label="Join now">Join Now</Link>
                <Link to="/features" className="btn btn-outline" aria-label="Learn more">Learn more</Link>
              </div>
            </div>
            <div
              className="hero-media"
              role="img"
              aria-label="Music community illustration"
            >
              {/* Replace with optimized <img srcSet> or an embedded player */}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="section-title">Built for artists and fans</h2>
            <div className="features-grid">
              <article className="feature-card" aria-labelledby="f1">
                <div className="feature-emoji">💰</div>
                <h3 id="f1">Tip Artists</h3>
                <p>Support your favorite artists instantly in Naira.</p>
              </article>

              <article className="feature-card" aria-labelledby="f2">
                <div className="feature-emoji">🎯</div>
                <h3 id="f2">Join Challenges</h3>
                <p>Participate in music challenges and win rewards.</p>
              </article>

              <article className="feature-card" aria-labelledby="f3">
                <div className="feature-emoji">🤝</div>
                <h3 id="f3">Connect</h3>
                <p>Follow artists and fans to grow your network.</p>
              </article>

              <article className="feature-card" aria-labelledby="f4">
                <div className="feature-emoji">🎶</div>
                <h3 id="f4">Share Music</h3>
                <p>Upload songs and share them instantly with the world.</p>
              </article>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works" aria-labelledby="how-title">
          <div className="container">
            <h2 id="how-title" className="section-title">How it works</h2>
            <div className="steps-grid">
              <div className="step">
                <span className="step-num">1</span>
                <h3>Join the Platform</h3>
                <p>Create your free account in seconds.</p>
              </div>
              <div className="step">
                <span className="step-num">2</span>
                <h3>Upload Your Music</h3>
                <p>Share your songs with fans instantly.</p>
              </div>
              <div className="step">
                <span className="step-num">3</span>
                <h3>Engage Your Audience</h3>
                <p>Follow, like, and tip others to grow your reach.</p>
              </div>
              <div className="step">
                <span className="step-num">4</span>
                <h3>Earn Tips</h3>
                <p>Get rewarded directly from your fans.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges preview */}
        <section className="challenges" aria-labelledby="challenges-title">
          <div className="container">
            <h2 id="challenges-title" className="section-title">Upcoming Challenges</h2>
            <div className="challenge-grid">
              <div className="challenge-card">
                <h3>Best Freestyle Contest</h3>
                <p>Show your freestyle skills and win ₦10,000.</p>
                <Link to="/signup" className="btn btn-primary" role="button">Join now</Link>
              </div>
              <div className="challenge-card">
                <h3>Cover Song Challenge</h3>
                <p>Perform your favorite hit and earn fan tips.</p>
                <Link to="/signup" className="btn btn-primary" role="button">Join now</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials" aria-labelledby="testi-title">
          <div className="container">
            <h2 id="testi-title" className="section-title">What our community says</h2>
            <div className="testimonial-grid">
              <blockquote>
                “I earned my first ₦5,000 from fans in just one week!”
                <cite>— DJ Gabson</cite>
              </blockquote>
              <blockquote>
                “This platform connects me directly with my audience.”
                <cite>— Dj Hophuray</cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-banner" aria-labelledby="cta-title">
          <div className="container">
            <h2 id="cta-title">Start sharing your music today</h2>
            <Link to="/signup" className="btn btn-cta" role="button" aria-label="Get started">Get started</Link>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} MyMusic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}