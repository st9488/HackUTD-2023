import json
from typing import Dict, List
import os
from dotenv import load_dotenv
import openai
from worker import Message

load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
TOKEN_LIMIT = 100


class SimpleAgent:
    def __init__(self, job, prompt, model="gpt-3.5-turbo") -> None:
        self.job: str = job
        self.prompt: str = prompt
        self.function_definitions: List[dict] = []
        self.function_callables: List[callable] = []
        self.model = model
        pass

    def add_function(self, function_definition, function: callable):
        self.function_definitions.append(function_definition)
        self.function_callables.append(function)

    def zeroshot_generate(self, message):
        messages = [
            Message(role="user", message=message),
            Message(role="system", message=self.prompt),
        ]
        completion = openai.ChatCompletion.create(
            model=self.model, messages=Message.convert_messages(messages)
        )
