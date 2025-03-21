class Task {
  constructor(name) {
    this.id = Date.now(); // Unique ID based on timestamp
    this.name = name;
    this.time = 0; // Initial timer time
    this.isRunning = false; // Timer is initially stopped
  }
}

export default Task;
