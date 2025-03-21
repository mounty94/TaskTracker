class Task {
  constructor(name, projectId = null) {
    this.id = Date.now(); // Unique ID based on timestamp
    this.name = name;
    this.time = 0; // Initial timer time
    this.isRunning = false; // Timer is initially stopped
    this.projectId = projectId; // Reference to the parent project
  }
}

export default Task;
