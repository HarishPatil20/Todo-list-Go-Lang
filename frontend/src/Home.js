import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaTasks, 
  FaChartPie, 
  FaRocket, 
  FaGithub, 
  FaTwitter, 
  FaLinkedin,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaStar,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineTaskAlt, MdSecurity } from "react-icons/md";

function Home() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Disable body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavigation = (path) => {
    setLoading(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const scrollToSection = (section) => {
    setMobileMenuOpen(false);
    const offsets = {
      features: window.innerHeight,
      about: window.innerHeight * 2,
      contact: document.body.scrollHeight
    };
    window.scrollTo({ 
      top: offsets[section] || 0, 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="home-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Animated Background */
        .background-animation {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .floating-shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          pointer-events: none;
        }

        .shape1 {
          width: min(300px, 50vw);
          height: min(300px, 50vw);
          top: -150px;
          right: -150px;
          background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
          animation: float 25s infinite;
        }

        .shape2 {
          width: min(400px, 70vw);
          height: min(400px, 70vw);
          bottom: -200px;
          left: -200px;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
          animation: float 30s infinite reverse;
        }

        .shape3 {
          width: min(200px, 40vw);
          height: min(200px, 40vw);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.05);
          animation: pulse 4s infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5vw, 5vh) rotate(90deg); }
          50% { transform: translate(0, 10vh) rotate(180deg); }
          75% { transform: translate(-5vw, 5vh) rotate(270deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.1; }
        }

        /* Mouse Follower - Hide on mobile */
        .mouse-follower {
          position: fixed;
          width: min(400px, 80vw);
          height: min(400px, 80vw);
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: transform 0.3s ease;
          z-index: 1;
        }

        /* Main Content */
        .content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Navbar */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          animation: slideDown 0.8s ease;
          position: relative;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: clamp(18px, 5vw, 24px);
          font-weight: 700;
        }

        .logo-icon {
          font-size: clamp(24px, 6vw, 32px);
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Desktop Navigation */
        .nav-links-desktop {
          display: flex;
          gap: 30px;
        }

        .nav-links-desktop a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
          cursor: pointer;
          font-size: clamp(14px, 3vw, 16px);
        }

        .nav-links-desktop a:hover {
          color: white;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 28px;
          cursor: pointer;
          z-index: 1001;
          padding: 8px;
        }

        /* Mobile Navigation Overlay */
        .mobile-nav-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 1000;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 30px;
          animation: fadeIn 0.3s ease;
        }

        .mobile-nav-overlay.open {
          display: flex;
        }

        .mobile-nav-link {
          color: white;
          font-size: 24px;
          font-weight: 600;
          cursor: pointer;
          padding: 15px 30px;
          border-radius: 40px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s;
          width: 80%;
          text-align: center;
        }

        .mobile-nav-link:active {
          transform: scale(0.95);
        }

        .close-menu-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: white;
          font-size: 36px;
          cursor: pointer;
        }

        /* Hero Section */
        .hero {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp 1s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .badge {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 40px;
          color: white;
          font-size: clamp(12px, 3vw, 14px);
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .hero h1 {
          font-size: clamp(32px, 8vw, 64px);
          font-weight: 800;
          color: white;
          margin-bottom: 15px;
          line-height: 1.2;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .hero h1 span {
          background: linear-gradient(45deg, #ffd700, #ffa500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        .hero p {
          font-size: clamp(14px, 4vw, 18px);
          color: rgba(255,255,255,0.9);
          max-width: 600px;
          margin: 0 auto 30px;
          line-height: 1.6;
          padding: 0 15px;
        }

        /* CTA Buttons */
        .cta-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          padding: 0 15px;
        }

        .btn {
          padding: clamp(12px, 3vw, 16px) clamp(24px, 5vw, 40px);
          border-radius: 50px;
          font-size: clamp(14px, 3.5vw, 18px);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-primary {
          background: white;
          color: #667eea;
        }

        .btn-primary:active {
          transform: scale(0.95);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .btn-secondary:active {
          transform: scale(0.95);
        }

        /* Stats */
        .stats {
          display: flex;
          justify-content: center;
          gap: clamp(20px, 5vw, 60px);
          margin-bottom: 60px;
          animation: fadeInUp 1s ease 0.2s both;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
          color: white;
          min-width: 120px;
        }

        .stat-number {
          font-size: clamp(24px, 6vw, 36px);
          font-weight: 700;
          margin-bottom: 5px;
          background: linear-gradient(45deg, #fff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: clamp(12px, 3vw, 14px);
          opacity: 0.8;
        }

        /* Features */
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(15px, 3vw, 30px);
          margin-bottom: 60px;
          padding: 0 10px;
        }

        .feature-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: clamp(20px, 4vw, 30px);
          color: white;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s, box-shadow 0.3s;
          animation: fadeInUp 1s ease;
          animation-fill-mode: both;
        }

        .feature-card:nth-child(1) { animation-delay: 0.3s; }
        .feature-card:nth-child(2) { animation-delay: 0.4s; }
        .feature-card:nth-child(3) { animation-delay: 0.5s; }

        .feature-card:active {
          transform: scale(0.98);
        }

        .feature-icon {
          font-size: clamp(32px, 8vw, 48px);
          margin-bottom: 15px;
          display: inline-block;
          padding: 15px;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
        }

        .feature-card h3 {
          font-size: clamp(16px, 4vw, 20px);
          margin-bottom: 10px;
        }

        .feature-card p {
          font-size: clamp(12px, 3vw, 14px);
          opacity: 0.8;
          line-height: 1.6;
        }

        /* Testimonials */
        .testimonials {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(15px, 3vw, 30px);
          margin-bottom: 60px;
          padding: 0 10px;
        }

        .testimonial-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: clamp(20px, 4vw, 30px);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          animation: fadeInUp 1s ease 0.6s both;
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .testimonial-avatar {
          width: clamp(40px, 8vw, 50px);
          height: clamp(40px, 8vw, 50px);
          border-radius: 50%;
          background: linear-gradient(45deg, #ffd700, #ffa500);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(16px, 4vw, 20px);
          font-weight: 600;
        }

        .testimonial-info h4 {
          font-size: clamp(14px, 3.5vw, 16px);
          margin-bottom: 5px;
        }

        .testimonial-info p {
          font-size: clamp(11px, 2.5vw, 12px);
          opacity: 0.7;
        }

        .testimonial-text {
          font-size: clamp(12px, 3vw, 14px);
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 15px;
        }

        .testimonial-rating {
          display: flex;
          gap: 3px;
          color: #ffd700;
          font-size: clamp(12px, 3vw, 14px);
        }

        /* Footer */
        .footer {
          text-align: center;
          color: rgba(255,255,255,0.7);
          padding: 30px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          animation: fadeInUp 1s ease 0.8s both;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 15px;
        }

        .social-links a {
          color: white;
          font-size: clamp(18px, 4vw, 20px);
          opacity: 0.7;
          transition: opacity 0.3s;
          padding: 8px;
        }

        .social-links a:active {
          opacity: 1;
        }

        .footer p {
          font-size: clamp(12px, 3vw, 14px);
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.9);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .loading-spinner {
          width: min(60px, 15vw);
          height: min(60px, 15vw);
          border: 5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Tablet Responsive */
        @media (max-width: 1024px) {
          .features {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mouse-follower {
            display: none;
          }

          .features {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .testimonials {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .stats {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .stat-item {
            width: 100%;
            max-width: 200px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .btn {
            justify-content: center;
            width: 100%;
          }

          .hero h1 {
            font-size: 36px;
          }

          .badge {
            font-size: 12px;
            padding: 6px 12px;
          }
        }

        /* Small Phones */
        @media (max-width: 480px) {
          .content {
            padding: 15px;
          }

          .hero h1 {
            font-size: 28px;
          }

          .hero p {
            font-size: 14px;
          }

          .feature-card {
            padding: 20px;
          }

          .feature-icon {
            font-size: 36px;
          }

          .testimonial-card {
            padding: 20px;
          }

          .mobile-nav-link {
            font-size: 20px;
            padding: 12px 20px;
          }
        }

        /* Landscape Mode */
        @media (max-height: 600px) and (orientation: landscape) {
          .hero {
            margin-bottom: 30px;
          }

          .hero h1 {
            font-size: 32px;
          }

          .stats {
            margin-bottom: 30px;
          }

          .features {
            grid-template-columns: repeat(3, 1fr);
          }

          .mobile-nav-overlay {
            gap: 15px;
          }

          .mobile-nav-link {
            font-size: 18px;
            padding: 10px 20px;
          }
        }

        /* Touch Device Optimizations */
        @media (hover: none) {
          .feature-card:hover,
          .btn:hover,
          .social-links a:hover {
            transform: none;
          }

          .btn:active {
            transform: scale(0.95);
          }

          .feature-card:active {
            transform: scale(0.98);
          }
        }
      `}</style>

      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
      </div>

      {/* Mouse Follower - Hidden on mobile */}
      <div 
        className="mouse-follower"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      ></div>

      {/* Main Content */}
      <div className="content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">
            <FaRocket className="logo-icon" />
            <span>TaskMaster Pro</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-links-desktop">
            <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</a>
            <a onClick={() => scrollToSection('features')}>Features</a>
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
            <a onClick={() => navigate("/")}>Logout</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars />
          </button>
        </nav>

        {/* Mobile Navigation Overlay */}
        <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
          <button 
            className="close-menu-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTimes />
          </button>
          <a className="mobile-nav-link" onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(false);
          }}>Home</a>
          <a className="mobile-nav-link" onClick={() => {
            scrollToSection('features');
            setMobileMenuOpen(false);
          }}>Features</a>
          <a className="mobile-nav-link" onClick={() => {
            scrollToSection('about');
            setMobileMenuOpen(false);
          }}>About</a>
          <a className="mobile-nav-link" onClick={() => {
            scrollToSection('contact');
            setMobileMenuOpen(false);
          }}>Contact</a>
          <a className="mobile-nav-link" onClick={() => {
            navigate("/");
            setMobileMenuOpen(false);
          }}>Logout</a>
        </div>

        {/* Hero Section */}
        <section className="hero">
          <div className="badge">
            <FaStar style={{ marginRight: '6px' }} />
            Welcome to the Future of Task Management
          </div>
          <h1>
            Organize Your Life <br />
            with <span>TaskMaster Pro</span>
          </h1>
          <p>
            The all-in-one productivity suite that helps you manage tasks, 
            track progress, and achieve your goals faster than ever before.
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => handleNavigation("/todo")}
            >
              <FaTasks /> Go to Todo <FaArrowRight />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleNavigation("/dashboard")}
            >
              <MdOutlineDashboard /> View Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features" id="features">
          <div className="feature-card">
            <div className="feature-icon">
              <FaTasks />
            </div>
            <h3>Smart Task Management</h3>
            <p>Create, organize, and prioritize tasks with our intuitive interface. Never miss a deadline again.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MdOutlineDashboard />
            </div>
            <h3>Advanced Analytics</h3>
            <p>Track your productivity with beautiful charts and insights. See your progress in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MdSecurity />
            </div>
            <h3>Secure & Reliable</h3>
            <p>Your data is encrypted and safe with us. Access your tasks from anywhere, anytime.</p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials" id="about">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">JD</div>
              <div className="testimonial-info">
                <h4>John Doe</h4>
                <p>Product Manager</p>
              </div>
            </div>
            <div className="testimonial-text">
              "TaskMaster Pro has completely transformed how I manage my daily tasks. The analytics dashboard is a game-changer!"
            </div>
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">JS</div>
              <div className="testimonial-info">
                <h4>Jane Smith</h4>
                <p>Freelancer</p>
              </div>
            </div>
            <div className="testimonial-text">
              "I love how easy it is to track my progress. The visual feedback keeps me motivated to complete more tasks."
            </div>
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer" id="contact">
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
          <p>&copy; 2024 TaskMaster Pro. All rights reserved.</p>
        </footer>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Home;