from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from worker import Worker

app = Flask(__name__)
CORS(app)

workers = {
    "Admin": Worker("Admin"),
    "Research": Worker("Research"),
    "Marketing": Worker("Marketing"),
    "Finance": Worker("Finance"),
    "Legal": Worker("Legal"),
    "IT": Worker("IT"),
    "HR": Worker("HR"),
}


@app.route('/')
def hello_world():
    return 'Hello, World!'