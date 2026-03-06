import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaPlus, 
  FaCheck, 
  FaTrash, 
  FaUndo,
  FaClipboardList,
  FaSearch,
  FaBars
} from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";

function Todo() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: "Bearer " + token,
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/tasks", {
        headers,
      });
      setTasks(res.data || []);
    } catch (err) {
      console.log(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/task",
        { title: title.trim() },
        { headers }
      );
      setTitle("");
      fetchTasks();
    } catch (err) {
      alert("Failed to add task");
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/complete/${id}`,
        {},
        { headers }
      );
      fetchTasks();
    } catch (err) {
      alert("Failed to complete task");
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(
          `http://localhost:5000/delete/${id}`,
          { headers }
        );
        fetchTasks();
      } catch (err) {
        alert("Failed to delete task");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const filteredTasks = (tasks || [])
    .filter(task => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });

  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .todo-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .todo-content {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Navbar */
        .navbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 12px 20px;
          border-radius: 12px;
          margin-bottom: 25px;
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
          color: white;
          cursor: pointer;
        }

        .logo-icon {
          font-size: 22px;
        }

        /* Desktop Navigation */
        .nav-links-desktop {
          display: flex;
          gap: 20px;
        }

        .nav-links-desktop a {
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
          font-size: 15px;
        }

        .nav-links-desktop a:hover {
          color: #ffd700;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
        }

        /* Mobile Navigation */
        .nav-links-mobile {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          left: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          margin-top: 10px;
          padding: 15px;
          flex-direction: column;
          gap: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 1000;
        }

        .nav-links-mobile.open {
          display: flex;
        }

        .nav-links-mobile a {
          color: #333;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
          padding: 12px;
          border-radius: 8px;
          background: rgba(102, 126, 234, 0.1);
          text-align: center;
        }

        .nav-links-mobile a:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        /* Header */
        .todo-header {
          text-align: center;
          margin-bottom: 30px;
          color: white;
        }

        .header-icon {
          font-size: 42px;
          margin-bottom: 12px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .todo-header h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(to right, #fff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .task-summary {
          display: flex;
          justify-content: center;
          gap: 15px;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .task-summary span {
          background: rgba(255,255,255,0.15);
          padding: 6px 16px;
          border-radius: 30px;
          backdrop-filter: blur(10px);
          white-space: nowrap;
        }

        /* Add Task Form */
        .add-task-form {
          background: white;
          border-radius: 12px;
          padding: 5px;
          display: flex;
          gap: 8px;
          margin-bottom: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 15px;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 0;
          border: none;
          outline: none;
          font-size: 15px;
          background: transparent;
        }

        .add-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }

        .add-button:active {
          transform: scale(0.98);
        }

        /* Filters and Search */
        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .search-box {
          flex: 1;
          min-width: 180px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f5f5f5;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          width: 100%;
        }

        .filter-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #f0f0f0;
          color: #666;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .sort-select {
          padding: 6px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          outline: none;
          background: white;
          color: #333;
          cursor: pointer;
          font-size: 13px;
          min-width: 120px;
        }

        /* Tasks List */
        .tasks-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .task-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s;
          animation: slideIn 0.3s ease;
          gap: 10px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .task-checkbox {
          min-width: 22px;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .task-checkbox.completed {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .task-content {
          flex: 1;
          min-width: 0; /* Prevents text overflow */
        }

        .task-title {
          font-size: 15px;
          color: #333;
          margin-bottom: 4px;
          transition: all 0.2s;
          word-break: break-word;
        }

        .task-title.completed {
          text-decoration: line-through;
          color: #999;
        }

        .task-date {
          font-size: 11px;
          color: #999;
        }

        .task-actions {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f5f5f5;
          color: #666;
        }

        .action-btn.complete:hover {
          background: #4CAF50;
          color: white;
        }

        .action-btn.delete:hover {
          background: #f44336;
          color: white;
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 50px 20px;
          background: white;
          border-radius: 12px;
          color: #999;
        }

        .empty-icon {
          font-size: 48px;
          color: #ddd;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 14px;
        }

        /* Progress Bar */
        .progress-bar-container {
          background: white;
          border-radius: 8px;
          height: 6px;
          overflow: hidden;
          margin-top: 20px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        /* Loading Animation */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .todo-container {
            padding: 12px;
          }

          .nav-links-desktop {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .todo-header h1 {
            font-size: 28px;
          }

          .header-icon {
            font-size: 36px;
          }

          .task-summary {
            gap: 8px;
          }

          .task-summary span {
            padding: 4px 12px;
            font-size: 12px;
          }

          .add-task-form {
            flex-direction: column;
            padding: 10px;
          }

          .input-wrapper {
            padding: 0 10px;
          }

          .input-wrapper input {
            padding: 10px 0;
          }

          .add-button {
            width: 100%;
            justify-content: center;
            padding: 12px;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
            padding: 12px;
          }

          .search-box {
            width: 100%;
          }

          .filter-buttons {
            justify-content: center;
            width: 100%;
          }

          .filter-btn {
            flex: 1;
            text-align: center;
            padding: 8px 6px;
            font-size: 12px;
          }

          .sort-select {
            width: 100%;
          }

          .task-item {
            padding: 12px;
          }

          .task-actions {
            gap: 4px;
          }

          .action-btn {
            width: 32px;
            height: 32px;
          }

          .empty-state {
            padding: 40px 15px;
          }

          .empty-icon {
            font-size: 42px;
          }

          .empty-state h3 {
            font-size: 16px;
          }

          .empty-state p {
            font-size: 13px;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .todo-container {
            padding: 8px;
          }

          .navbar {
            padding: 10px 15px;
          }

          .logo {
            font-size: 16px;
          }

          .logo-icon {
            font-size: 20px;
          }

          .todo-header h1 {
            font-size: 24px;
          }

          .task-item {
            flex-wrap: wrap;
          }

          .task-content {
            width: calc(100% - 70px);
          }

          .task-actions {
            width: 100%;
            margin-top: 10px;
            justify-content: flex-end;
          }

          .task-summary {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }

          .task-summary span {
            width: 100%;
            text-align: center;
          }

          .filter-buttons {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 5px;
            -webkit-overflow-scrolling: touch;
          }

          .filter-btn {
            flex: 0 0 auto;
          }
        }

        /* Landscape mode */
        @media (max-height: 600px) and (orientation: landscape) {
          .todo-container {
            padding: 10px;
          }

          .todo-header {
            margin-bottom: 15px;
          }

          .header-icon {
            font-size: 30px;
            margin-bottom: 5px;
          }

          .todo-header h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }

          .tasks-list {
            max-height: 50vh;
            overflow-y: auto;
          }
        }
      `}</style>

      <div className="todo-content">
        {/* Navbar with Mobile Menu */}
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/Home")}>
            <FaRocket className="logo-icon" />
            <span>TaskMaster Pro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links-desktop">
            <a onClick={() => navigate("/Home")}>Home</a>
            <a onClick={() => navigate("/todo")}>Todo</a>
            <a onClick={() => navigate("/dashboard")}>Dashboard</a>
            <a onClick={() => navigate("/")}>Logout</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars />
          </button>

          {/* Mobile Navigation */}
          <div className={`nav-links-mobile ${mobileMenuOpen ? 'open' : ''}`}>
            <a onClick={() => {
              navigate("/Home");
              setMobileMenuOpen(false);
            }}>Home</a>
            <a onClick={() => {
              navigate("/todo");
              setMobileMenuOpen(false);
            }}>Todo</a>
            <a onClick={() => {
              navigate("/dashboard");
              setMobileMenuOpen(false);
            }}>Dashboard</a>
            <a onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}>Logout</a>
          </div>
        </nav>

        {/* Header */}
        <div className="todo-header">
          <MdOutlineTaskAlt className="header-icon" />
          <h1>TaskMaster Pro</h1>
          <div className="task-summary">
            <span>{tasks.length} Total</span>
            <span>{activeTasks} Active</span>
            <span>{completedTasks} Done</span>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="add-task-form">
          <div className="input-wrapper">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              maxLength="100"
            />
          </div>
          <button className="add-button" onClick={addTask}>
            <FaPlus /> Add
          </button>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch style={{ color: '#999', fontSize: '14px' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Done
            </button>
          </div>

          <select 
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="tasks-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div 
                  className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                  onClick={() => !task.completed && completeTask(task.id)}
                >
                  {task.completed && <FaCheck style={{ color: 'white', fontSize: '12px' }} />}
                </div>
                
                <div className="task-content">
                  <div className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </div>
                  <div className="task-date">
                    {new Date(task.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="task-actions">
                  {task.completed ? (
                    <button 
                      className="action-btn complete"
                      onClick={() => completeTask(task.id)}
                      title="Undo"
                    >
                      <FaUndo />
                    </button>
                  ) : (
                    <button 
                      className="action-btn complete"
                      onClick={() => completeTask(task.id)}
                      title="Complete"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button 
                    className="action-btn delete"
                    onClick={() => deleteTask(task.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaClipboardList className="empty-icon" />
            <h3>No tasks found</h3>
            <p>
              {searchTerm 
                ? "No matches found" 
                : filter !== 'all' 
                ? `No ${filter} tasks` 
                : "Add your first task!"}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Todo;