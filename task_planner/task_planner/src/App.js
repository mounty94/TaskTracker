import React, { useState, useEffect } from "react";
import TaskList from "./TaskList"; // TaskList displays tasks
import AddTaskForm from "./AddTaskForm"; // Form to add new tasks
import Task from "./Task"; // Task model
import { Container } from "@mui/material";

function App() {
  const [tasks, setTasks] = useState([]); // Holds tasks from the backend

  // Fetch tasks from Flask API when the app starts
  useEffect(() => {
    fetch("http://127.0.0.1:5000/tasks") // Connect to Flask backend
      .then((response) => response.json()) // Convert response to JSON
      .then((data) => setTasks(data)) // Set tasks state
      .catch((error) => console.error("Error fetching tasks:", error)); // Error handling
  }, []); // Runs only once on component mount

  // Add task function
  const addTask = (newTaskName) => {
    const newTask = new Task(newTaskName); // Create a new Task object

    // Add task to the backend via POST
    fetch("http://127.0.0.1:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask), // Send task as JSON
    })
      .then((response) => response.json()) // Get the response task data
      .then((data) => {
        setTasks([...tasks, data]); // Update state with new task

        // Update the backend to start the timer (if needed, this step may be redundant since is_running is already true)
        startTimer(data.id);
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Delete task function
  const deleteTask = (taskId) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, { method: "DELETE" }) // Send DELETE request
      .then(() => setTasks(tasks.filter((task) => task.id !== taskId))) // Remove from state
      .catch((error) => console.error("Error deleting task:", error));
  };

  //Toggle completion function
  const onToggleCompletion = (taskId, currentCompletion) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_completed: !currentCompletion }), // Update only the "is_completed" field
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        // Update the React state to reflect the change
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Timer functionality
  const startTimer = (taskId) => {
    const now = Date.now();
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_running: true, last_updated: now }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id
              ? { ...updatedTask, last_updated: now }
              : task
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const stopTimer = (taskId) => {
    const now = Date.now();
    const taskToStop = tasks.find((task) => task.id === taskId);

    const elapsedTime = Math.floor(
      (now - new Date(taskToStop.last_updated).getTime()) / 1000
    );
    const updatedTime = taskToStop.time + elapsedTime;

    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_running: false, time: updatedTime }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.is_running) {
            console.log(new Date(task.last_updated).getTime());
            const lastUpdatedTime = new Date(task.last_updated).getTime();
            const elapsedTime = Math.floor((now - lastUpdatedTime) / 1000);
            console.log(
              "Task:",
              task.id,
              "Now:",
              now,
              "Last Updated:",
              lastUpdatedTime,
              "Elapsed Time:",
              elapsedTime
            );
            return {
              ...task,
              time: task.time + elapsedTime,
              last_updated: now, // Update last_updated to current time
            };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [tasks]);

  return (
    <Container maxWidth="lg">
      <h1>Hello, Mountasser</h1>
      <h1>Task Planner</h1>
      {/* Add new task form */}
      <AddTaskForm onAdd={addTask} onStartTimer={startTimer} />
      {/* Show tasklist with tasItem template*/}
      <TaskList
        tasks={tasks}
        onDelete={deleteTask}
        onStart={startTimer}
        onStop={stopTimer}
        onToggleCompletion={onToggleCompletion}
      />
    </Container>
  );
}

export default App;
