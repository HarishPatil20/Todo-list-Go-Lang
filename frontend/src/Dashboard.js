import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaTasks, 
  FaCheckCircle, 
  FaChartPie, 
  FaClock,
  FaRocket,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaTrophy,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { MdOutlineDashboard, MdTrendingUp } from "react-icons/md";

function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    total: 0,
    completed: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/analytics", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        
        // Ensure we have the correct data structure
        if (res.data) {
          setAnalytics({
            total: res.data.total || 0,
            completed: res.data.completed || 0,
            percentage: res.data.percentage || 0
          });
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to load analytics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    } else {
      setError("Please log in to view analytics");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const total = analytics.total || 0;
  const completed = analytics.completed || 0;
  const percentage = Math.min(100, Math.max(0, analytics.percentage || 0)); // Ensure percentage is between 0-100
  const pending = Math.max(0, total - completed);

  // Determine color based on completion percentage
  const getProgressColor = () => {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 50) return '#f59e0b'; // Orange
    if (percentage >= 25) return '#f97316'; // Orange-red
    return '#ef4444'; // Red
  };

  // Get status message
  const getStatusMessage = () => {
    if (total === 0) return "Add some tasks to get started!";
    if (percentage === 100) return "Perfect! All tasks completed! 🎉";
    if (percentage >= 80) return "Excellent progress! Almost there!";
    if (percentage >= 50) return "Good job! Keep going!";
    if (percentage >= 25) return "You're making progress!";
    return "Start completing your tasks!";
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (percentage > 50) return <FaArrowUp style={{ color: '#10b981' }} />;
    if (percentage > 25) return <FaArrowUp style={{ color: '#f59e0b' }} />;
    return <FaArrowDown style={{ color: '#ef4444' }} />;
  };

  return (
    <div className="dashboard-container">
      <style>{`
/* Navbar */
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  border: 1px solid rgba(255,255,255,0.2);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: white;
  cursor: pointer;
}

.logo-icon {
  font-size: 24px;
}

.nav-links {
  display: flex;
  gap: 25px;
}

.nav-links a {
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.nav-links a:hover {
  color: #ffd700;
}

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Loading Container */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error Container */
        .error-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }

        .error-icon {
          font-size: 64px;
          margin-bottom: 20px;
          color: #fbbf24;
        }

        .error-container h3 {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .error-container p {
          margin-bottom: 20px;
          opacity: 0.9;
        }

        .retry-button {
          background: white;
          color: #667eea;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* Header Styles */
        .dashboard-header {
          margin-bottom: 40px;
          color: white;
        }

        .header-top {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .dashboard-icon {
          font-size: 40px;
          background: rgba(255,255,255,0.2);
          padding: 12px;
          border-radius: 16px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .dashboard-header h1 {
          font-size: 42px;
          font-weight: 700;
          background: linear-gradient(to right, #fff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .date-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.15);
          padding: 10px 20px;
          border-radius: 40px;
          font-size: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .status-badge {
          margin-left: 15px;
          background: rgba(255,255,255,0.2);
          padding: 10px 20px;
          border-radius: 40px;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }

        .stat-info {
          flex: 1;
        }

        .stat-info h3 {
          color: #64748b;
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .stat-number {
          font-size: 48px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: #64748b;
        }

        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* Progress Section */
        .progress-section {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 30px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          margin-bottom: 30px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .progress-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 40px;
        }

        .progress-header h2 {
          font-size: 28px;
          color: #1e293b;
          font-weight: 700;
        }

        .progress-circle-container {
          display: flex;
          flex-wrap: wrap;
          gap: 50px;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .progress-circle {
          width: 280px;
          height: 280px;
          position: relative;
        }

        .circular-chart {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .circle-bg {
          stroke: #e2e8f0;
          stroke-width: 8;
          fill: none;
        }

        .circle {
          stroke: ${getProgressColor()};
          stroke-width: 8;
          fill: none;
          stroke-linecap: round;
          transition: stroke-dasharray 1s ease-in-out;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }

        .percentage-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .percentage-number {
          font-size: 56px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .percentage-label {
          font-size: 16px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .progress-stats {
          flex: 1;
          min-width: 250px;
        }

        .progress-stat-item {
          margin-bottom: 25px;
        }

        .progress-stat-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #64748b;
          font-size: 15px;
          font-weight: 500;
        }

        .progress-bar-bg {
          width: 100%;
          height: 10px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 10px;
          transition: width 1s ease-in-out;
          position: relative;
        }

        .progress-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0));
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Progress Details Grid */
        .progress-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin-top: 40px;
        }

        .detail-card {
          background: #f8fafc;
          border-radius: 20px;
          padding: 25px;
          text-align: center;
          transition: transform 0.3s;
          border: 1px solid #e2e8f0;
        }

        .detail-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .detail-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .detail-card h4 {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .detail-sub {
          font-size: 13px;
          color: #94a3b8;
        }

        /* Quote Section */
        .quote-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 35px;
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .quote-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .quote-icon {
          font-size: 32px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          animation: bounce 2s infinite;
        }

        .quote-text {
          font-size: 22px;
          font-weight: 500;
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
          line-height: 1.4;
        }

        .quote-author {
          font-size: 16px;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .progress-circle-container {
            flex-direction: column;
            gap: 30px;
          }

          .progress-circle {
            width: 240px;
            height: 240px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 20px 15px;
          }

          .dashboard-header h1 {
            font-size: 32px;
          }

          .header-top {
            flex-wrap: wrap;
          }

          .stat-number {
            font-size: 36px;
          }

          .progress-section {
            padding: 25px;
          }

          .progress-details-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .percentage-number {
            font-size: 42px;
          }

          .detail-value {
            font-size: 28px;
          }

          .quote-text {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .stat-card {
            padding: 20px;
          }

          .stat-icon {
            width: 60px;
            height: 60px;
            font-size: 28px;
          }

          .stat-number {
            font-size: 32px;
          }

          .progress-circle {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>

      <div className="dashboard-content">
        {/* Navbar */}
<nav className="navbar">
  <div className="logo" onClick={() => navigate("/home")}>
    <FaRocket className="logo-icon" />
    <span>TaskMaster Pro</span>
  </div>

  <div className="nav-links">
    <a onClick={() => navigate("/home")}>Home</a>
    <a onClick={() => navigate("/todo")}>Todo</a>
    <a onClick={() => navigate("/dashboard")}>Dashboard</a>
    <a onClick={() => {
      localStorage.removeItem("token");
      navigate("/");
    }}>
      Logout
    </a>
  </div>
</nav>
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-top">
            <MdOutlineDashboard className="dashboard-icon" />
            <h1>Task Analytics Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div className="date-badge">
              <FaClock style={{ marginRight: '8px' }} />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="status-badge">
              {getTrendIcon()}
              <span>{getStatusMessage()}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Tasks</h3>
              <div className="stat-number">{total}</div>
              <div className="stat-trend">
                <FaTasks style={{ marginRight: '5px' }} />
                {total === 0 ? 'No tasks yet' : `${total} total task${total !== 1 ? 's' : ''}`}
              </div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <FaTasks />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Completed</h3>
              <div className="stat-number">{completed}</div>
              <div className="stat-trend">
                <FaCheckCircle style={{ marginRight: '5px', color: '#10b981' }} />
                {completed === 0 ? 'No completed tasks' : `${((completed/total) * 100 || 0).toFixed(1)}% of total`}
              </div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <FaCheckCircle />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Pending</h3>
              <div className="stat-number">{pending}</div>
              <div className="stat-trend">
                <FaClock style={{ marginRight: '5px', color: '#f59e0b' }} />
                {pending === 0 ? 'All done!' : `${((pending/total) * 100 || 0).toFixed(1)}% remaining`}
              </div>
            </div>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <FaClock />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <FaChartPie style={{ fontSize: '32px', color: '#667eea' }} />
            <h2>Completion Overview</h2>
          </div>

          <div className="progress-circle-container">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100" className="circular-chart">
                <circle 
                  className="circle-bg" 
                  cx="50" 
                  cy="50" 
                  r="45" 
                />
                <circle 
                  className="circle" 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  strokeDasharray={`${(percentage * 2.827), 282.7}`}
                  strokeDashoffset={0}
                />
              </svg>
              <div className="percentage-text">
                <div className="percentage-number">{percentage}%</div>
                <div className="percentage-label">Complete</div>
              </div>
            </div>

            <div className="progress-stats">
              <div className="progress-stat-item">
                <div className="progress-stat-header">
                  <span>Overall Progress</span>
                  <span style={{ color: getProgressColor(), fontWeight: 600 }}>{percentage}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${percentage}%`, background: getProgressColor() }}
                  ></div>
                </div>
              </div>

              <div className="progress-stat-item">
                <div className="progress-stat-header">
                  <span>Completed vs Total</span>
                  <span>{completed} / {total}</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(completed / (total || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="progress-stat-item">
                <div className="progress-stat-header">
                  <span>Remaining</span>
                  <span>{pending} tasks</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(pending / (total || 1)) * 100}%`, background: '#f59e0b' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="progress-details-grid">
            <div className="detail-card">
              <div className="detail-icon" style={{ color: '#10b981' }}>
                <FaTrophy />
              </div>
              <h4>Achievement</h4>
              <div className="detail-value">
                {percentage === 100 ? 'Perfect!' : 
                 percentage >= 80 ? 'Excellent' :
                 percentage >= 50 ? 'Good' :
                 percentage >= 25 ? 'Getting There' : 'Keep Going'}
              </div>
              <div className="detail-sub">{percentage}% completed</div>
            </div>

            <div className="detail-card">
              <div className="detail-icon" style={{ color: '#667eea' }}>
                <FaCalendarCheck />
              </div>
              <h4>Tasks Left</h4>
              <div className="detail-value">{pending}</div>
              <div className="detail-sub">
                {pending === 0 ? 'All completed!' : 
                 pending === 1 ? 'Last task remaining' : `${pending} tasks to go`}
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon" style={{ color: '#764ba2' }}>
                <MdTrendingUp />
              </div>
              <h4>Progress</h4>
              <div className="detail-value">{completed}/{total}</div>
              <div className="detail-sub">
                {total === 0 ? 'Add tasks to start' : 
                 `${((completed/total) * 100).toFixed(1)}% complete`}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="quote-section">
          <FaRocket className="quote-icon" />
          <div className="quote-text">
            {percentage === 100 
              ? "🎉 Congratulations! You've conquered all your tasks! Time to celebrate your achievement!" 
              : percentage >= 80 
              ? "🚀 You're in the final stretch! Keep that momentum going - you're almost at the finish line!" 
              : percentage >= 50 
              ? "💪 Great progress! You're more than halfway there. Keep pushing forward!" 
              : percentage >= 25 
              ? "✨ You're making solid progress! Every task completed is a step closer to your goal." 
              : "🌟 Start small, think big. Every great achievement begins with a single task. You've got this!"}
          </div>
          <div className="quote-author">- TaskMaster Pro</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;