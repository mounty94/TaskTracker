from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

# Enable CORS for all routes
#CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app)
 
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    time = db.Column(db.Integer, default=0)  # Time spent on the task in seconds
    is_completed = db.Column(db.Boolean, default=False)
    is_running = db.Column(db.Boolean, default=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "time": self.time,
            "is_completed": self.is_completed,
            "is_running": self.is_running,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None
        }

# Create the database and tables
with app.app_context():
    db.create_all()

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    new_task = Task(name=data['name'],
        time=0,  # Initialize time to 0 when a task is created
        is_running=True,  # Initialize is_running as True
        last_updated=datetime.utcnow()  # Initialize with current time 
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
    
    task.name = data.get('name', task.name)
    task.time = data.get('time', task.time)
    task.is_completed = data.get('is_completed', task.is_completed)
    task.is_running = data.get('is_running', task.is_running)
      # Update last_updated only if the timer is started
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
