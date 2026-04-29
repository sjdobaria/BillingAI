import { useNavigate } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiMail } from 'react-icons/fi';
import aboutImage from '../assets/about_healthcare.png';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ── Navbar ── */}
      <nav className="lp-navbar" id="lp-navbar">
        <div className="lp-navbar-inner">
          <a href="/" className="lp-logo">
            <FiActivity className="lp-logo-icon" />
            <span>BillingAI</span>
          </a>
          <div className="lp-nav-links">
            <button className="lp-nav-link" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-btn-primary lp-nav-cta" onClick={() => navigate('/register')}>
              Get Started <FiArrowRight />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="lp-hero" id="lp-hero">
        <div className="lp-hero-bg-orbs">
          <div className="lp-orb lp-orb-1"></div>
          <div className="lp-orb lp-orb-2"></div>
          <div className="lp-orb lp-orb-3"></div>
        </div>
        <div className="lp-hero-content">
          <div className="lp-hero-text">
            <h1 className="lp-hero-title">
              Predict Your
              <span className="lp-gradient-text"> Healthcare Bill </span>
              with Confidence
            </h1>
            <p className="lp-hero-subtitle">
              Transparent, intelligent billing predictions powered by machine learning.
              Get accurate cost estimates before your treatment begins.
            </p>
            <div className="lp-hero-actions">
              <button className="lp-btn-primary lp-btn-lg" onClick={() => navigate('/register')}>
                Start Predicting <FiArrowRight />
              </button>
            </div>
          </div>
          <div className="lp-hero-image">
            <div className="lp-hero-image-glow"></div>
            <img src={aboutImage} alt="Healthcare AI Dashboard" />
          </div>
        </div>
      </section>



      {/* ── Footer ── */}
      <footer className="lp-footer" id="lp-footer">
        <div className="lp-footer-main">
          <div className="lp-footer-grid">
            {/* Brand Column */}
            <div className="lp-footer-col lp-footer-brand-col">
              <div className="lp-footer-brand">
                <FiActivity className="lp-logo-icon" />
                <span>BillingAI</span>
              </div>
              <p className="lp-footer-desc">
                AI-powered healthcare billing predictions using machine learning.
                Get accurate cost estimates before your treatment begins.
              </p>
            </div>

            {/* Quick Links */}
            <div className="lp-footer-col">
              <h4 className="lp-footer-heading">Quick Links</h4>
              <ul className="lp-footer-links">
                <li><button onClick={() => navigate('/login')}>Sign In</button></li>
                <li><button onClick={() => navigate('/register')}>Create Account</button></li>
                <li><button onClick={() => navigate('/dashboard')}>Dashboard</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lp-footer-col">
              <h4 className="lp-footer-heading">Contact</h4>
              <ul className="lp-footer-links">
                <li><a href="mailto:sjdobaria@gmail.com"><FiMail /> sjdobaria@gmail.com</a></li>

              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="lp-footer-bottom">
          <div className="lp-footer-bottom-inner">
            <p className="lp-footer-copy">
              © {new Date().getFullYear()} BillingAI. All rights reserved.
            </p>
            <p className="lp-footer-credits">
              Built by <strong>Sahil Dobaria</strong>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
