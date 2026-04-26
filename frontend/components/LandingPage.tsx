import React from 'react';
import './Landing.css';

interface LandingPageProps {
  onSignin: () => void;
  error?: Error | null;
}

export default function LandingPage({ onSignin, error }: LandingPageProps) {
  // Determine if this is the specific "State" error we want to recover from
  const isRecoverableError = error?.message.includes("No matching state");
  const showCriticalError = error && !isRecoverableError;

  return (
    <div className="landing-container">
      {/* Navbar - Structure matches your provided CSS */}
      <nav className="navbar">
        <div className="navContent">
          <span className="appName">ShopComp</span>
          
          <div className="navLinks">
            {/* Using navLink class for the Sign In action */}
            <button 
              className="navLink" 
              onClick={onSignin}
              style={{ background: 'none', border: 'none', fontSize: '1rem', padding: 0 }}
            >
              Sign In
            </button>
            {/* Optional: A 'Register' button styled like your logoutButton but blue/green? 
                For now, we'll stick to a simple Sign In link in the header */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="contentWrapper">
          <h1>Stop Guessing. <br />Start Saving.</h1>
          <p className="hero-subtext">
            Upload receipts to track real prices, build smart shopping lists, 
            and let our algorithm tell you exactly where to buy for the best deal.
          </p>

          {/* Error / Status Messages */}
          {isRecoverableError && (
            <div className="status-message warning">
              Session refreshed. Please sign in to continue.
            </div>
          )}
          
          {showCriticalError && (
             <div className="status-message error">
               ERROR: {error.message}
             </div>
          )}

          <div className="cta-wrapper">
            <button className="cta-button" onClick={onSignin}>
              Join Now & Save
            </button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <div className="contentWrapper">
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">📸</div>
              <h3>AI Receipt Scanner</h3>
              <p>
                Snap a photo. We parse items and prices to build your personal database.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">🛒</div>
              <h3>Smart Lists</h3>
              <p>
                Create lists and let ShopComp find the lowest total cost across chains.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">📊</div>
              <h3>Spending Insights</h3>
              <p>
                Track purchasing habits with daily, weekly, and monthly activity reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="contentWrapper">
          <p>&copy; {new Date().getFullYear()} ShopComp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}