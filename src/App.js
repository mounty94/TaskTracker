import React, { useState, useEffect } from "react";
import TaskList from "./TaskList"; // TaskList displays tasks
import AddTaskForm from "./AddTaskForm"; // Form to add new tasks
import AddProjectForm from "./AddProjectForm";
import Task from "./Task"; // Task model
import Project from "./Project";
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, TextField, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Grid, Tabs, Tab, ListItemSecondaryAction } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Delete as DeleteIcon, Info as InfoIcon, Add as AddIcon, PlayArrow as PlayIcon, Stop as StopIcon } from '@mui/icons-material';
import ProjectDetails from './components/ProjectDetails';

function App() {
  const [tasks, setTasks] = useState([]); // Holds tasks from the backend
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetailsOpen, setProjectDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch tasks and projects from Flask API when the app starts
  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Add project function
  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          status: "Not Started",
        }),
      });
      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setNewProjectName('');
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  // Add task function
  const addTask = async () => {
    if (!newTaskName.trim()) return;
    try {
      const response = await fetch("http://127.0.0.1:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskName,
          projectId: null,
        }),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setNewTaskName('');
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task function
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Delete project function
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/projects/${projectId}`, { method: "DELETE" });
      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== projectId));
        setTasks(tasks.filter((task) => task.projectId !== projectId));
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
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
  const startTimer = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_running: true }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ));
      }
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  };

  const stopTimer = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_running: false }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ));
      }
    } catch (error) {
      console.error("Error stopping timer:", error);
    }
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

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setProjectDetailsOpen(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Task Tracker
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Projects" />
        <Tab label="All Tasks" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New Project
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <TextField
                    fullWidth
                    label="New Project Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleAddProject}
                    disabled={!newProjectName.trim()}
                  >
                    Add Project
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Projects
            </Typography>
            <List>
              {projects.map((project) => (
                <ListItem
                  key={project.id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="view"
                        onClick={() => handleViewProject(project)}
                        sx={{ mr: 1 }}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          setProjectToDelete(project);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={project.name}
                    secondary={`Status: ${project.status} | Tasks: ${project.tasks?.length || 0}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New Task
            </Typography>
            <AddTaskForm onAddTask={addTask} projects={projects} />
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tasks
            </Typography>
            <List>
              {tasks.map((task) => (
                <ListItem key={task.id}>
                  <ListItemText
                    primary={task.title}
                    secondary={`Project: ${projects.find(p => p.id === task.projectId)?.name || 'No Project'} | Time: ${formatTime(task.time)}`}
                  />
                  <ListItemSecondaryAction>
                    {task.is_running ? (
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => stopTimer(task.id)}
                        sx={{ mr: 1 }}
                      >
                        <StopIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() => startTimer(task.id)}
                        sx={{ mr: 1 }}
                      >
                        <PlayIcon />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => deleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleDeleteProject(projectToDelete?.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={projectDetailsOpen}
        onClose={() => setProjectDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <ProjectDetails
            projectId={selectedProject.id}
            onClose={() => setProjectDetailsOpen(false)}
          />
        )}
      </Dialog>
    </Container>
  );
}

export default App;
