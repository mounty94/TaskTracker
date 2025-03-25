from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Enable CORS for all routes
CORS(app)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='Not Started')
    team = db.Column(db.Text)
    stakeholder = db.Column(db.String(100))
    tasks = db.relationship('Task', backref='project', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "status": self.status,
            "team": self.team,
            "stakeholder": self.stakeholder,
            "tasks": [task.to_dict() for task in self.tasks]
        }
 
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    time = db.Column(db.Integer, default=0)
    is_completed = db.Column(db.Boolean, default=False)
    is_running = db.Column(db.Boolean, default=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "time": self.time,
            "completed": self.is_completed,
            "is_running": self.is_running,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None,
            "projectId": self.project_id
        }

# Create the database and tables
def init_db():
    # Delete existing database file if it exists
    if os.path.exists('tasks.db'):
        os.remove('tasks.db')
    
    with app.app_context():
        db.create_all()

init_db()

# Project routes
@app.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects])

@app.route('/projects', methods=['POST'])
def add_project():
    data = request.get_json()
    new_project = Project(name=data['name'])
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201

@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project and its tasks deleted"})

@app.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify(project.to_dict())

@app.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    
    project.name = data.get('name', project.name)
    project.description = data.get('description', project.description)
    project.start_date = datetime.fromisoformat(data['start_date']) if data.get('start_date') else project.start_date
    project.end_date = datetime.fromisoformat(data['end_date']) if data.get('end_date') else project.end_date
    project.status = data.get('status', project.status)
    project.team = data.get('team', project.team)
    project.stakeholder = data.get('stakeholder', project.stakeholder)
    
    db.session.commit()
    return jsonify(project.to_dict())

# Task routes
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    new_task = Task(
        title=data['title'],
        time=0,
        is_running=True,
        last_updated=datetime.utcnow(),
        project_id=data.get('projectId')
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    task.title = data.get('title', task.title)
    task.time = data.get('time', task.time)
    task.is_completed = data.get('completed', task.is_completed)
    task.is_running = data.get('is_running', task.is_running)
    task.project_id = data.get('projectId', task.project_id)
    if data.get('is_running', None) == True:
        task.last_updated = datetime.utcnow()
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})

if __name__ == "__main__":
    app.run(debug=True)
