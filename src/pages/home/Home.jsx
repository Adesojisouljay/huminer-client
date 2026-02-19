import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import HuminerLogo from "../../components/HuminerLogo"; // Import Logo
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
          <Link to="/" className="brand" aria-label="Huminer home">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HuminerLogo width={40} height={40} />
              <span>HUMINER</span>
            </div>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/signup" className="nav-cta" role="button">Start Mining</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1 id="hero-title">Mine Your <span className="highlight">Potential</span>. Unearth Your <span className="highlight">Worth</span>.</h1>
              <p className="hero-sub">
                Join the social economy where creativity is the new gold. Everyone is a celebrity, and every interaction has real value.
              </p>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary" role="button" aria-label="Start mining">Start Mining</Link>
                <Link to="/features" className="btn btn-outline" aria-label="Learn more">Learn more</Link>
              </div>
            </div>
            <div
              className="hero-media"
              role="img"
              aria-label="Huminer community illustration"
            >
              {/* Abstract visual representing mining/connection */}
              <div className="hero-visual-pattern"></div>
            </div>
          </div>
        </section>

        {/* Community Section (New) */}
        <section className="community-section">
          <div className="container community-inner">
            <div className="community-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop"
                alt="Huminer Community"
                className="community-image"
              />
              <div className="floating-card card-1">
                <span>💎</span> @SoulJay tipped 500
              </div>
            </div>
            <div className="community-text">
              <h2>Find Your <span className="highlight-text">Tribe</span>.</h2>
              <p>
                Connect with people who value your creativity. Huminer isn't just an app; it's a movement where your interactions create real wealth.
              </p>
              <Link to="/signup" className="btn btn-primary">Start Connecting</Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="section-title">The Human Mining Ecosystem</h2>
            <div className="features-grid">
              <article className="feature-card" aria-labelledby="f1">
                <div className="feature-emoji">💎</div>
                <h3 id="f1">Reward Value</h3>
                <p>Support creators instantly. Your appreciation has real financial value.</p>
              </article>

              <article className="feature-card" aria-labelledby="f2">
                <div className="feature-emoji">🚀</div>
                <h3 id="f2">Showcase Talent</h3>
                <p>Participate in challenges. Prove your worth and earn rewards.</p>
              </article>

              <article className="feature-card" aria-labelledby="f3">
                <div className="feature-emoji">🔗</div>
                <h3 id="f3">Build Networks</h3>
                <p>Connect with fellow miners. Grow your influence and net worth.</p>
              </article>

              <article className="feature-card" aria-labelledby="f4">
                <div className="feature-emoji">🎨</div>
                <h3 id="f4">Share Resources</h3>
                <p>Upload your creativity. Music, art, ideas—it's all a mineable resource.</p>
              </article>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works" aria-labelledby="how-title">
          <div className="container">
            <h2 id="how-title" className="section-title">How to Mine</h2>
            <div className="steps-grid">
              <div className="step">
                <span className="step-num">1</span>
                <h3>Claim Your Space</h3>
                <p>Create your Huminer account and set up your profile.</p>
              </div>
              <div className="step">
                <span className="step-num">2</span>
                <h3>Share Content</h3>
                <p>Upload your creative assets and share them with the world.</p>
              </div>
              <div className="step">
                <span className="step-num">3</span>
                <h3>Engage & Mine</h3>
                <p>Interact with others. Every like, comment, and share builds value.</p>
              </div>
              <div className="step">
                <span className="step-num">4</span>
                <h3>Earn Rewards</h3>
                <p>Get tipped directly for your contributions and creativity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges preview */}
        <section className="challenges" aria-labelledby="challenges-title">
          <div className="container">
            <h2 id="challenges-title" className="section-title">Active Excavations (Challenges)</h2>
            <div className="challenge-grid">
              <div className="challenge-card">
                <h3>Best Freestyle Contest</h3>
                <p>Show your flow and mine the grand prize of ₦10,000.</p>
                <Link to="/signup" className="btn btn-primary" role="button">Join Excavation</Link>
              </div>
              <div className="challenge-card">
                <h3>Creative Cover Challenge</h3>
                <p>Remix a hit and earn tips from the community.</p>
                <Link to="/signup" className="btn btn-primary" role="button">Join Excavation</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials" aria-labelledby="testi-title">
          <div className="container">
            <h2 id="testi-title" className="section-title">Voices from the Mine</h2>
            <div className="testimonial-grid">
              <blockquote>
                “Huminer turned my creativity into a career. I'm mining value every day!”
                <cite>— DJ Gabson</cite>
              </blockquote>
              <blockquote>
                “Finally, a platform where my interactions actually mean something.”
                <cite>— Dj Hophuray</cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-banner" aria-labelledby="cta-title">
          <div className="container">
            <h2 id="cta-title">Start mining your potential today</h2>
            <Link to="/signup" className="btn btn-cta" role="button" aria-label="Get started">Get Started</Link>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} Huminer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}