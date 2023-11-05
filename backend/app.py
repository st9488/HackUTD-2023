import json
from flask import Flask, request
from flask_cors import CORS
from worker import Worker, Message, Suggestion
from typing import Dict, List

app = Flask(__name__)
CORS(app)

workers: Dict[str, Worker] = {}


@app.before_request
def setup_workers():
    """
    Setup the workers.
    """

    if len(workers) > 0:
        return

    workers["Admin"] = Worker(
        name="Sally",
        job="CEO",
        prompt="You are talking to the user. Your job is solely to direct the admin to one of the following departments: Research, Marketing, Finance, Legal, IT, HR.",
        type="Admin",
    )
    workers["Admin"].add_suggestion("Fire everyone in HR", False, "phase1")

    workers["Research"] = Worker(
        name="Bob",
        job="Researcher",
        prompt="You are talking to the user, and you are in charge of research.",
        type="Research",
    )
    workers["Research"].add_suggestion("Create a new product", False, "phase1")

    workers["Marketing"] = Worker(
        name="Alice",
        job="Marketing Manager",
        prompt="You are talking to the user, and you are in charge of marketing.",
        type="Marketing",
    )
    workers["Marketing"].add_suggestion("Create a TikTok Account", False, "phase1")

    workers["Finance"] = Worker(
        name="Jerry",
        job="CFO",
        prompt="You are talking to the user, and you are in charge of finances.",
        type="Finance",
    )
    workers["Finance"].add_suggestion("Make a Budget", False, "phase1")

    workers["Legal"] = Worker(
        name="Keith",
        job="Lawyer",
        prompt="You are are talking to a client.",
        type="Legal",
    )
    workers["Legal"].add_suggestion("Sue your competitors", False, "phase1")

    workers["IT"] = Worker(
        name="Tim",
        job="IT Manager",
        prompt="You are are talking to the user, and you are in charge of IT.",
        type="IT",
    )
    workers["IT"].add_suggestion("Kick your Router", False, "phase1")

    workers["HR"] = Worker(
        name="Robert",
        job="HR Manager",
        prompt="You are are talking to the user, and you are in charge of customer service.",
        type="HR",
    )
    workers["HR"].add_suggestion("File a Complaint", False, "phase1")


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


@app.route("/generate_suggestion/<worker_type>", methods=["POST"])
def generate_suggestion(worker_type):
    """
    Generate a suggestion for a worker.
    """
    content = request.form["message"]
    workers[worker_type].add_suggestion(
        workers[worker_type].generate_action_from_message(content), False, "phase1"
    )
    return "OK"


@app.route("/get_suggestions", methods=["GET"])
def get_suggestions():
    suggestions: List[Suggestion] = []
    for worker in workers.values():
        suggestions.extend(worker.suggestions)
    output = Suggestion.serialize_list(suggestionList=suggestions)
    return output


@app.route("/update_suggestion", methods=["POST"])
def update_suggestion():
    suggestion = request.form["suggestion"]
    newcompleted = request.form["newcompleted"]
    newphase = request.form["newphase"]
    newsuggestion = request.form["newsuggestion"]

    # go through workers and find the suggestion
    print(suggestion)
    print(newcompleted)
    for worker in workers.values():
        for worker_suggestion in worker.suggestions:
            if worker_suggestion.message == suggestion:
                worker_suggestion.completed = newcompleted
                worker_suggestion.phase = newphase
                worker_suggestion.message = newsuggestion
                print("worker suggestions:", worker.suggestions)
                return "200"

    # if the suggestion is not found, create it under the admin worker
    workers["Admin"].add_suggestion(newsuggestion, newcompleted, newphase)
    return "201"


@app.route("/delete_suggestion", methods=["POST"])
def delete_suggestion():
    suggestion = request.form["suggestion"]

    # go through workers and find the suggestion
    for worker in workers.values():
        for worker_suggestion in worker.suggestions:
            if worker_suggestion.message == suggestion:
                worker.suggestions.remove(worker_suggestion)
                return "OK"

    return "505"
