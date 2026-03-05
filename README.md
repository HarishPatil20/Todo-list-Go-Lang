# 📝 Todo List Application (Go + React)

A full-stack **Todo List Application** built using **Go (Golang) for the backend** and **React for the frontend**.
This project allows users to **register, login, and manage tasks efficiently** with a clean and modern UI.

---

## 🚀 Features

* 🔐 User Authentication (Login & Register)
* ➕ Add new tasks
* ✅ Mark tasks as completed
* 🔄 Undo completed tasks
* 🗑 Delete tasks
* 🔍 Search tasks
* 📊 Dashboard with task statistics
* 📅 Task creation date
* 🔑 JWT token authentication
* 🎨 Modern responsive UI with React

---

## 🛠 Tech Stack

### Frontend

* React.js
* Axios
* React Router
* React Icons
* CSS

### Backend

* Go (Golang)
* Gin Framework
* JWT Authentication
* REST API

### Database

* MySQL / SQLite (depending on your setup)

---

## 📂 Project Structure

```
Todo-list-Go-Lang
│
├── backend
│   ├── main.go
│   ├── routes
│   ├── models
│   ├── database
│   └── go.mod
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.js
│   ├── package.json
│   └── public
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/HarishPatil20/Todo-list-Go-Lang.git
cd Todo-list-Go-Lang
```

---

### 2️⃣ Run Backend (Go)

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
go mod tidy
```

Run the server:

```bash
go run main.go
```

Backend will start at:

```
http://localhost:5000
```

---

### 3️⃣ Run Frontend (React)

Open another terminal and go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React app:

```bash
npm start
```

Frontend will start at:

```
http://localhost:3000
```

---

## 📸 Screenshots

Add screenshots of your application here.

Example:

```
Login Page
Todo Dashboard
Task List
```

---

## 🔑 API Endpoints

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| POST   | /register     | Register new user   |
| POST   | /login        | Login user          |
| GET    | /tasks        | Get all tasks       |
| POST   | /task         | Create task         |
| PUT    | /complete/:id | Mark task completed |
| DELETE | /delete/:id   | Delete task         |

---

## 👨‍💻 Author

**Harish Patil**

GitHub:
https://github.com/HarishPatil20

---

## ⭐ Support

If you like this project, please give it a **⭐ on GitHub**.
