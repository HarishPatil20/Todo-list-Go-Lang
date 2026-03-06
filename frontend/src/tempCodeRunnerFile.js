import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const fetchTodos = async () => {
    const url = showCompleted
      ? `http://localhost:5000/getCompleted/${email}`
      : `http://localhost:5000/getTodos/${email}`;

    const res = await axios.get(url);
    setTodos(res.data || []);
  };

  const addTodo = async () => {
    if (!task) return;

    await axios.post("http://localhost:5000/addTodo", {
      email,
      task,
    });

    setTask("");
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    await axios.put(`http://localhost:5000/toggleTodo/${id}`);
    fetchTodos();
  };

  const completed = todos.filter(t => t.completed).length;
  const progress = todos.length
    ? Math.round((completed / todos.length) * 100)
    : 0;

  useEffect(() => {
    fetchTodos();
  }, [showCompleted]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Daily Task Manager</h2>

      <h4>Today's Progress: {progress}%</h4>
      <div style={{ background: "#ddd", height: 10 }}>
        <div style={{
          width: `${progress}%`,
          background: "green",
          height: "100%"
        }} />
      </div>

      <br />

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTodo}>Add</button>

      <button onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? "Show All" : "Show Completed Today"}
      </button>

      <ul>
        {todos.map((t) => (
          <li key={t._id}>
            <span
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
              onClick={() => toggleTodo(t._id)}
            >
              {t.task} ({new Date(t.createdAt).toLocaleTimeString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;