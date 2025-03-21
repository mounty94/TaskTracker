import React from "react";
import TaskItem from "./TaskItem"; // TaskItem for rendering individual tasks

function TaskList({ tasks, onDelete, onStart, onStop, onToggleCompletion }) {
  return (
    <div>
      <h2>Your Tasks</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => onDelete(task.id)} // Pass delete handler
            onStart={() => onStart(task.id, task.is_running)} // Pass start timer handler
            onStop={() => onStop(task.id, task.is_running, task.time)} // Pass stop timer handler
            onToggleCompletion={() =>
              onToggleCompletion(task.id, task.is_completed)
            } // Pass the handler
          />
        ))
      ) : (
        <p>No tasks added yet!</p>
      )}
    </div>
  );
}

export default TaskList;
