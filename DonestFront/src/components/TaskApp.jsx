import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TaskApp.css"; // Import the CSS file

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(null);

  const API_BASE_URL = "http://localhost:8080/api/tasks";

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const [incompleteResponse, completeResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}?completed=false`),
        axios.get(`${API_BASE_URL}?completed=true`),
      ]);
      setTasks(incompleteResponse.data);
      setCompletedTasks(completeResponse.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle form submission to add a task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert("Task title is required");
      return;
    }
    try {
      const response = await axios.post(API_BASE_URL, {
        ...newTask,
        completed: false,
      });
      setTasks((prev) => [...prev, response.data]);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle task completion
  const handleCompleteTask = async (id) => {
    try {
      const taskToComplete = tasks.find((task) => task.id === id);
      const response = await axios.put(`${API_BASE_URL}/${id}`, {
        ...taskToComplete,
        completed: true,
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setCompletedTasks((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setCompletedTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle editing a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/${editingTask.id}`, {
        ...editingTask,
        ...newTask,
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? response.data : task))
      );
      setEditingTask(null);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-app">
      {/* Logo */}
      <img src="/path/to/your/logo.png" alt="Logo" className="logo" />

      <h1>To-Do List</h1>
      <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
      </form>

      <h2>Tasks List</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-actions">
              <button onClick={() => handleCompleteTask(task.id)}>Complete</button>
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Completed Tasks</h2>
      <div className="task-list">
        {completedTasks.map((task) => (
          <div key={task.id} className="task-card completed">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskApp;
