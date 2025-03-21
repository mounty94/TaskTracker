import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function AddProjectForm({ onAddProject }) {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onAddProject(projectName);
      setProjectName('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        disabled={!projectName.trim()}
      >
        Add Project
      </Button>
    </Box>
  );
}

export default AddProjectForm; 