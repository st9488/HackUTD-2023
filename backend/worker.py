import json
from typing import Dict, List
import os
from dotenv import load_dotenv
import openai

load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]


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
    def convert_messages(messages):
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
                max_tokens=500,
            )
        else:
            completion = openai.ChatCompletion.create(
                model=self.model,
                messages=Message.convert_messages(self.memory),
                max_tokens=500,
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
            max_tokens=500,
        )

        return json.loads(completion.choices[0].message.function_call.arguments)[
            "action_item"
        ]
