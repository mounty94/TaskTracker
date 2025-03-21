import React from "react";
import { Grid, Button, Checkbox, Typography } from "@mui/material";

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
        <p>Time: {task.time} seconds</p>
      </Grid>

      {/* Start/Stop Timer and Delete Button */}
      <Grid item xs={4}>
        {task.is_running ? (
          <Button variant="contained" size="small" onClick={onStop}>
            Stop Timer
          </Button>
        ) : (
          <Button variant="contained" size="small" onClick={onStart}>
            Start Timer
          </Button>
        )}
        <Button variant="outlined" size="small" onClick={onDelete}>
          Delete Task
        </Button>
      </Grid>
    </Grid>
  );
}

export default TaskItem;
