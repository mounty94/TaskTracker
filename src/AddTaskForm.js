import React, { useState } from "react";
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function AddTaskForm({ onAddTask, projects }) {
  const [taskName, setTaskName] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask(taskName, selectedProject);
      setTaskName("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Project</InputLabel>
        <Select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          label="Project"
        >
          <MenuItem value="">No Project</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        disabled={!taskName.trim()}
      >
        Add Task
      </Button>
    </Box>
  );
}

export default AddTaskForm;
