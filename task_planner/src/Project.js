class Project {
  constructor(name) {
    this.id = Date.now(); // Unique ID based on timestamp
    this.name = name;
    this.tasks = []; // Array to store task IDs
  }
}

export default Project; 