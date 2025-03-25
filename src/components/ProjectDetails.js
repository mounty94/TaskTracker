import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ProjectDetails = ({ projectId, onClose }) => {
  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/projects/${projectId}`);
      const data = await response.json();
      setProject(data);
      setEditData(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setEditData(updatedProject);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleChange = (field) => (event) => {
    setEditData({
      ...editData,
      [field]: event.target.value,
    });
  };

  if (!project) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Project Details
          </Typography>
          <Box>
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setOpenDeleteDialog(true)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={editData.name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={editData.description || ''}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={editData.start_date ? editData.start_date.split('T')[0] : ''}
                onChange={handleChange('start_date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={editData.end_date ? editData.end_date.split('T')[0] : ''}
                onChange={handleChange('end_date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={editData.status}
                onChange={handleChange('status')}
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stakeholder"
                value={editData.stakeholder || ''}
                onChange={handleChange('stakeholder')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Team Members"
                value={editData.team || ''}
                onChange={handleChange('team')}
                helperText="Enter team members separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {project.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {project.description || 'No description provided'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body1">
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                End Date
              </Typography>
              <Typography variant="body1">
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">{project.status}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Stakeholder
              </Typography>
              <Typography variant="body1">{project.stakeholder || 'Not assigned'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Team Members
              </Typography>
              <Typography variant="body1">{project.team || 'No team members assigned'}</Typography>
            </Grid>
          </Grid>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <List>
          {project.tasks?.map((task) => (
            <ListItem key={task.id}>
              <ListItemText
                primary={task.title}
                secondary={`Status: ${task.completed ? 'Completed' : 'In Progress'} | Time: ${task.time} seconds`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails; 