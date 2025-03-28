import React from "react";
import { Grid, Button, Checkbox, Typography } from "@mui/material";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function TaskItem({ task, onDelete, onStart, onStop, onToggleCompletion }) {
  return (
    <Grid container spacing={1} alignItems="center">
      {/* Checkbox to mark task as completed */}
      <Grid item xs={1}>
        <Checkbox
          checked={task.is_completed} // Reflect the completed state
          onChange={onToggleCompletion} // Toggle completion
        />
      </Grid>

      {/* Task name */}
      <Grid item xs={5}>
        <Typography
          variant="h6"
          sx={{
            textDecoration: task.is_completed ? "line-through" : "none",
          }}
        >
          {task.name}
        </Typography>
      </Grid>

      {/* Task time */}
      <Grid item xs={2}>
        <Typography>
          Time: {formatTime(task.time)}
        </Typography>
      </Grid>

      {/* Start/Stop Timer and Delete Button */}
      <Grid item xs={4}>
        {task.is_running ? (
          <Button 
            variant="contained" 
            color="secondary" 
            size="small" 
            onClick={onStop}
            sx={{ mr: 1 }}
          >
            Stop Timer
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            onClick={onStart}
            sx={{ mr: 1 }}
          >
            Start Timer
          </Button>
        )}
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          onClick={onDelete}
        >
          Delete Task
        </Button>
      </Grid>
    </Grid>
  );
}

export default TaskItem;
