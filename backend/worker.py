import json
from typing import Dict, List
import os
from dotenv import load_dotenv
import openai

load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
TOKEN_LIMIT = 100


class OpenAIFunction:
    def __init__(self, function: callable) -> None:
        # print("new function:", self.name, self.description)
        # exit(-1)
        self.name = function.__name__
        self.description = function.__doc__
        self.callable_function = function

    def __str__(self) -> str:
        return f"{self.name}: {self.description}"

    def __repr__(self) -> str:
        return f"{self.name}: {self.description}"


class Suggestion:
    def __init__(self, message: str, completed: bool, phase: str) -> None:
        self.message = message
        self.completed = completed
        self.phase = phase

    def serializer(self):
        """
        Converts a suggestion object to a dictionary.
        """
        return {
            "message": self.message,
            "completed": self.completed,
            "phase": self.phase,
        }

    @staticmethod
    def serialize_list(suggestionList):
        """
        Converts a list of suggestions to a list of dictionaries.
        """
        return [Suggestion.serializer(suggestion) for suggestion in suggestionList]


class Message:
    def __init__(self, role: str, message: str, function_name: str = None):
        self.role = role
        self.message = message
        self.function_name = function_name

    def __str__(self):
        return f'"{self.role}: {self.message}"'

    def __repr__(self):
        return f'"{self.role}: {self.message}"'

    @staticmethod
    def serializer(message):
        """
        Converts a message object to a dictionary.
        """
        if message.function_name is None:
            return {"role": message.role, "content": message.message}
        else:
            return {
                "role": message.role,
                "content": message.message,
                "name": message.function_name,
            }

    @staticmethod
    def deserializer(message):
        """
        Converts a dictionary to a message object.
        """
        if "name" in message:
            return Message(message["role"], message["content"], message["name"])
        return Message(message["role"], message["content"])

    @staticmethod
    def convert_messages(messages) -> List[Dict[str, str]]:
        """
        Converts a list of messages to a list of dictionaries.
        """
        return [Message.serializer(message) for message in messages]

    @staticmethod
    def consume_completion(completion):
        """
        Consumes an OpenAI completion and returns a new message object.
        """
        role = completion.choices[0].message.role
        content = completion.choices[0].message.content
        return Message(role, content)


class Worker:
    def __init__(
        self,
        name: str,
        job: str,
        prompt: str,
        model: str = "gpt-3.5-turbo",
        type: str = "",
    ):
        self.name: str = name
        self.job: str = job
        self.memory: List[Message] = []
        self.prompt: str = prompt
        self.functions: List[OpenAIFunction] = []
        self.suggestions: List[Suggestion] = []
        self.model: str = model
        self.type: str = type

        # possible roles in conversation are: ['system', 'user', 'assistant', 'function']
        self.memory.append(
            Message(
                "system",
                f"Here is your character profile: Your name is {self.name}. You are a {self.job}. {self.prompt} Respond with short answers that provide a good explanation to the user.",
            )
        )

    def receive_message(self, content: str):
        """
        Add a message to the worker's memory. This can be seen as talking to the worker.
        """
        self.memory.append(Message("user", content))

    def next_message(self):
        """
        Get the next message from the worker given their current memory, and append it to their memory.
        """

        function_candidates = []

        for func in self.functions:
            function_candidates.append(
                {
                    "name": func.name,
                    "description": func.description,
                    "parameters": {"type": "object", "properties": {}},
                }
            )

        function_force = "auto"
        completion = None
        if len(self.functions) > 0:
            completion = openai.ChatCompletion.create(
                model=self.model,
                messages=Message.convert_messages(self.memory),
                functions=function_candidates,
                function_call=function_force,
                max_tokens=TOKEN_LIMIT,
            )
        else:
            completion = openai.ChatCompletion.create(
                model=self.model,
                messages=Message.convert_messages(self.memory),
                max_tokens=TOKEN_LIMIT,
            )
        # print(completion)

        if "function_call" not in completion.choices[0].message:
            self.memory.append(
                Message(
                    completion.choices[0].message.role,
                    completion.choices[0].message.content,
                )
            )
            message = Message.consume_completion(completion)
            self.memory.append(message)
        else:
            # this is a function call
            function_name = completion.choices[0].message.function_call.name

            # get the function object from self.functions
            function = None
            # print("searching for function:", function_name, "in", self.functions)
            for func in self.functions:
                # print(
                #     "checking if func.name == function_name:", func.name, function_name
                # )
                if func.name == function_name:
                    function = func
                    break

            if function is not None:
                function_output = function.callable_function()
                self.memory.append(Message("function", function_output, function_name))
                self.next_message()
            else:
                raise Exception("function not found")

    def add_suggestion(self, message: str, completed: bool, phase: str):
        """
        Add a suggestion to the worker's suggestion list.
        """
        self.suggestions.append(Suggestion(message, completed, phase))

    def add_function(self, function: callable):
        """
        Add a function to the worker's function list.
        """
        self.functions.append(OpenAIFunction(function))

    def generate_action_from_message(self, message: str) -> str:
        """
        Generate an action from the worker's memory.
        """
        messages = [
            Message(
                "system",
                "You are a function that returns an action item from a given message. The user will send you a message, and you should output an action item using the output_action function. Even if you feel like there is no action item, you should still output something. For example, if the user says 'I am sad', you could output 'Cheer up!'",
            ),
            Message("user", message),
        ]

        function_call = {"name": "output_action"}

        functions = [
            {
                "name": "output_action",
                "description": "Display an action item to the user.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "action_item": {
                            "type": "string",
                            "description": "The action item to display to the user.",
                        }
                    },
                },
            }
        ]

        completion = openai.ChatCompletion.create(
            model=self.model,
            messages=Message.convert_messages(messages),
            functions=functions,
            function_call=function_call,
            max_tokens=TOKEN_LIMIT,
        )

        return json.loads(completion.choices[0].message.function_call.arguments)[
            "action_item"
        ]

    def talk_to_worker(self, other_worker):
        """
        This function is used to facilitate inter-worker communication.
        """

        # first we assume that we are initiating the conversation.
        # we send a message to the other worker and record it in our memory.
        self.memory.append(
            Message(
                "system",
                f"You are now going to talk to {other_worker.name}. They are a {other_worker.job}.",
            )
        )
        self.next_message()

        # make sure the other worker knows what the first one said
        other_worker.memory.append(
            Message(
                "system",
                f"You are now going to talk to {self.name}. They are a {self.job}.",
            )
        )
        other_worker.memory.append(Message("user", self.memory[-1].message))
        other_worker.next_message()

        # end the conversation
        self.receive_message(other_worker.memory[-1].message)
        self.memory.append(
            Message(
                "system",
                f"The conversation between {self.name} and {other_worker.name} has ended. You are now talking to the user again.",
            )
        )
        other_worker.memory.append(
            Message(
                "system",
                f"The conversation between {self.name} and {other_worker.name} has ended. You are now talking to the user again.",
            )
        )

    def decide_to_respond(self) -> bool:
        """
        This function is used to decide whether or not to respond to a message. This is primarily for
        conversations where the user is talking to multiple workers at once.
        """

        # create the decision prompt
        prompt = f"""Knowing the full context of the conversation up to this point, do you believe that responding to the previous message would make sense? If so, use the display_message function to output a true or false. Output true if you should respond and it makes sense to respond. Output false if you should not respond."""

        self.memory.append(Message("system", prompt))

        # create the function call
        function_call = {"name": "display_message"}

        # create the function
        functions = [
            {
                "name": "display_message",
                "description": "Display a message to the user.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "whether_or_not_you_should_respond": {
                            "type": "boolean",
                            "description": "Set this to true if you should respond to the previous message. Set this to false if you should not respond to the previous message.",
                        }
                    },
                },
            }
        ]

        # generate the completion
        completion = openai.ChatCompletion.create(
            model=self.model,
            messages=Message.convert_messages(self.memory),
            functions=functions,
            function_call=function_call,
            max_tokens=TOKEN_LIMIT,
        )

        # wipe the last memory
        self.memory.pop()

        # get the response
        response = json.loads(completion.choices[0].message.function_call.arguments)[
            "whether_or_not_you_should_respond"
        ]

        # return the response
        return response == "True"

    def begin_multi_agent_conversation(self):
        self.memory.append(
            Message(
                "system",
                f'This is now a multi-agent conversation. Your name is {self.name}. Each person will precede their message with their name and a colon such as "George: Hello Jerry!" which signifies that George is speaking.',
            )
        )

    def end_multi_agent_conversation(self):
        self.memory.append(
            Message("system", "This is no longer a multi-agent conversation.")
        )

    def read_my_suggestions(self):
        """
        This is for inserting a workers suggestions into the memory (just return the suggestions in text).
        """
        return f"The following suggestions have been made by {self.name}: {Suggestion.serialize_list(self.suggestions)}"


class MultiAgentConversation:
    def __init__(self, workers: List[Worker], conversation_goal: str = None) -> None:
        for worker in workers:
            worker.begin_multi_agent_conversation()
        self.workers = workers
        self.current_worker = 0
        self.first_message = True
        self.passes = 0
        self.conversation_ended = False
        self.goal = conversation_goal

    def __del__(self):
        for worker in self.workers:
            worker.end_multi_agent_conversation()

    def send_message_to_workers(self, message: str, sending_worker_name: str):
        """
        Send a message to all workers in the conversation.
        """
        for worker in self.workers:
            if worker.name != sending_worker_name:
                worker.receive_message(message)

    def iterate(self):
        """
        Iterate through the workers in the conversation.
        """
        # if this is the first messgae, then force the first worker to send a message
        if self.first_message:
            self.workers[self.current_worker].next_message()
            # get the message the worker sent
            message = self.workers[self.current_worker].memory[-1].message
            # send the message to the other workers
            self.send_message_to_workers(
                message, self.workers[self.current_worker].name
            )
            # increment the current worker
            self.current_worker += 1
            self.current_worker %= len(self.workers)
            # set first message to false
            self.first_message = False
        else:
            # get the current worker
            current_worker = self.workers[self.current_worker]

            # decide whether or not to respond
            should_respond = current_worker.decide_to_respond()

            # if the worker should respond, then respond
            if should_respond:
                self.workers[self.current_worker].next_message()
                # get the message the worker sent
                message = self.workers[self.current_worker].memory[-1].message
                # send the message to the other workers
                self.send_message_to_workers(
                    message, self.workers[self.current_worker].name
                )

                self.passes = 0
            else:
                self.passes += 1

            # increment the current worker
            self.current_worker += 1
            self.current_worker %= len(self.workers)

            if self.passes > len(self.workers):
                self.first_message = True
                self.passes = 0
