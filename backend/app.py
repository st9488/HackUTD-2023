import json
from flask import Flask, request
from flask_cors import CORS
from worker import Worker, Message
from typing import Dict

app = Flask(__name__)
CORS(app)

workers: Dict[str, Worker] = {}


@app.before_first_request
def setup_workers():
    """
    Setup the workers.
    """

    workers["Admin"] = Worker(
        name="Sally", job="CEO", prompt="You are talking to the user.", type="Admin"
    )

    workers["Research"] = Worker(
        name="Bob",
        job="Researcher",
        prompt="You are talking to the user, and you are in charge of research.",
        type="Research",
    )

    workers["Marketing"] = Worker(
        name="Alice",
        job="Marketing Manager",
        prompt="You are talking to the user, and you are in charge of marketing.",
        type="Marketing",
    )

    workers["Finance"] = Worker(
        name="Jerry",
        job="CFO",
        prompt="You are talking to the user, and you are in charge of finances.",
        type="Finance",
    )

    workers["Legal"] = Worker(
        name="Keith",
        job="Lawyer",
        prompt="You are are talking to a client.",
        type="Legal",
    )

    workers["IT"] = Worker(
        name="Tim",
        job="IT Manager",
        prompt="You are are talking to the user, and you are in charge of IT.",
        type="IT",
    )

    workers["HR"] = Worker(
        name="Robert",
        job="HR Manager",
        prompt="You are are talking to the user, and you are in charge of customer service.",
        type="HR",
    )


@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/get_workers", methods=["GET"])
def get_workers():
    return str(workers.keys())


@app.route("/send_message/<worker_type>", methods=["POST"])
def send_message(worker_type):
    """
    Send a message to a worker. Will also return a message.
    """
    content = request.form["message"]
    workers[worker_type].receive_message(content)
    workers[worker_type].next_message()
    return workers[worker_type].memory[-1].message


@app.route("/get_worker_memory/<worker_type>", methods=["GET"])
def get_worker_memory(worker_type):
    return Message.convert_messages(workers[worker_type].memory)
