# Task Tracker

A full-stack task management application built with React and Flask. Track your tasks, organize them into projects, and monitor time spent on each task.

## Features

- Create and manage tasks
- Organize tasks into projects
- Track time spent on tasks with start/stop timer
- Mark tasks as completed
- Persistent storage with SQLite database

## Technology Stack

- Frontend: React with Material-UI
- Backend: Flask with SQLAlchemy
- Database: SQLite

## Setup

### Backend Setup

1. Navigate to the project directory
2. Create a Python virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Usage

- Create projects to organize your tasks
- Add tasks with or without project association
- Use the timer to track time spent on tasks
- Mark tasks as complete when finished
- Delete tasks or entire projects as needed
