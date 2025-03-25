# Task Tracker

A full-stack task management application built with React and Flask.

## Features

- Create and manage projects
- Add tasks to projects
- Track time spent on tasks
- Mark tasks as complete
- View project details including:
  - Project description
  - Start and end dates
  - Project status
  - Team members
  - Stakeholder information

## Technology Stack

- Frontend: React with Material-UI
- Backend: Flask with SQLAlchemy
- Database: SQLite

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

### Running the Application

1. Start both backend and frontend servers:
```bash
npm start
```

This will start:
- Flask backend on http://127.0.0.1:5000
- React frontend on http://localhost:3000

## Usage

1. Create a new project by entering a project name and clicking "Add Project"
2. Add tasks to projects using the "Add New Task" form
3. Click the info icon on a project to view and edit project details
4. Use the timer to track time spent on tasks
5. Mark tasks as complete when finished
6. Delete projects or tasks as needed

## Project Structure

```
tasktracker/
├── app.py              # Flask backend
├── requirements.txt    # Python dependencies
├── package.json       # Node.js dependencies
├── public/            # Static files
├── src/               # React source code
│   ├── components/    # React components
│   ├── App.js         # Main application component
│   └── index.js       # Application entry point
└── instance/          # SQLite database
    └── tasks.db       # Database file
```
