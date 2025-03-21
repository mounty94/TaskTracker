import React, { useState, useEffect } from "react";
import TaskList from "./TaskList"; // TaskList displays tasks
import AddTaskForm from "./AddTaskForm"; // Form to add new tasks
import AddProjectForm from "./AddProjectForm";
import Task from "./Task"; // Task model
import Project from "./Project";
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function App() {
  const [tasks, setTasks] = useState([]); // Holds tasks from the backend
  const [projects, setProjects] = useState([]);

  // Fetch tasks and projects from Flask API when the app starts
  useEffect(() => {
    fetch("http://127.0.0.1:5000/tasks") // Connect to Flask backend
      .then((response) => response.json()) // Convert response to JSON
      .then((data) => setTasks(data)) // Set tasks state
      .catch((error) => console.error("Error fetching tasks:", error)); // Error handling

    fetch("http://127.0.0.1:5000/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []); // Runs only once on component mount

  // Add project function
  const addProject = (projectName) => {
    fetch("http://127.0.0.1:5000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects([...projects, data]);
      })
      .catch((error) => console.error("Error adding project:", error));
  };

  // Add task function
  const addTask = (taskName, projectId) => {
    fetch("http://127.0.0.1:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: taskName,
        projectId: projectId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]);
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Delete task function
  const deleteTask = (taskId) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, { method: "DELETE" }) // Send DELETE request
      .then(() => setTasks(tasks.filter((task) => task.id !== taskId))) // Remove from state
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Delete project function
  const deleteProject = (projectId) => {
    fetch(`http://127.0.0.1:5000/projects/${projectId}`, { method: "DELETE" })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== projectId));
        setTasks(tasks.filter((task) => task.projectId !== projectId));
      })
      .catch((error) => console.error("Error deleting project:", error));
  };

  // Toggle completion function
  const onToggleCompletion = (taskId, currentCompletion) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !currentCompletion }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !currentCompletion } : task
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Timer functionality
  const startTimer = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentTime = task.time || 0;

    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        is_running: true,
        time: currentTime
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId 
              ? { 
                  ...t, 
                  is_running: true,
                  time: currentTime
                } 
              : t
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const stopTimer = (taskId) => {
    const taskToStop = tasks.find((task) => task.id === taskId);
    if (!taskToStop) return;

    const currentTime = taskToStop.time || 0;

    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        is_running: false,
        time: currentTime
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId 
              ? { 
                  ...task, 
                  is_running: false,
                  time: currentTime
                } 
              : task
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.is_running) {
            return {
              ...task,
              time: (task.time || 0) + 1
            };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Task Tracker
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Project
        </Typography>
        <AddProjectForm onAddProject={addProject} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Task
        </Typography>
        <AddTaskForm onAddTask={addTask} projects={projects} />
      </Box>

      <Typography variant="h6" gutterBottom>
        Projects and Tasks
      </Typography>

      {projects.map((project) => (
        <Accordion key={project.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{project.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TaskList
              tasks={tasks.filter((task) => task.projectId === project.id)}
              onDelete={deleteTask}
              onToggleCompletion={onToggleCompletion}
              onStart={startTimer}
              onStop={stopTimer}
            />
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tasks without Project
        </Typography>
        <TaskList
          tasks={tasks.filter((task) => !task.projectId)}
          onDelete={deleteTask}
          onToggleCompletion={onToggleCompletion}
          onStart={startTimer}
          onStop={stopTimer}
        />
      </Box>
    </Container>
  );
}

export default App;
