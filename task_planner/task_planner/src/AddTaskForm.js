import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

function AddTaskForm({ onAdd, onStartTimer }) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newTask.trim()) {
      // Call onAdd and get the new task ID
      const newTaskId = await onAdd(newTask);

      if (newTaskId) {
        // Start the timer for the newly created task
        onStartTimer(newTaskId);
      }

      setNewTask(""); // Clear the input field
    }
  };

  // function AddTaskForm({ onAdd, onStartTimer }) {
  //   const [newTask, setNewTask] = useState("");

  //   // Submit handler for adding tasks
  //   const handleSubmit = (e) => {
  //     e.preventDefault(); // Prevent default form submission
  //     if (newTask.trim() !== "") {
  //       onAdd(newTask); // Call parent function
  //       // Optionally trigger the timer logic here
  //       setTimeout(() => {
  //         const taskId = 1; // Get the actual task ID from your backend's response logic if needed
  //         onStartTimer(taskId);
  //       }, 500); // Delay to ensure the task is added before starting the timer

  //       setNewTask(""); // Reset input
  //     }
  //   };

  return (
    <div>
      <Paper
        component="div" // Changed to div to avoid form nesting conflict
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          marginTop: "16px", // Add spacing between the two elements
          width: 400,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Start a task"
          inputProps={{ "aria-label": "start a task" }}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <IconButton
          sx={{ p: "10px" }}
          aria-label="start timer"
          onClick={handleSubmit} // Correctly bind the handleSubmit function
        >
          <PlayCircleIcon />
        </IconButton>
      </Paper>
    </div>
  );
}

export default AddTaskForm;
