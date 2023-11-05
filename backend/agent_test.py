import json
from worker import Worker, OpenAIFunction, Message


def user_speak_example():
    """
    Example of a user speaking to a worker.
    """
    lawyer = Worker(
        name="Jerry",
        job="Lawyer",
        prompt="You are are talking to a client.",
    )

    def get_weather():
        """
        Get a description of the weather in the user's city.
        """
        return "The weather is sunny, but quite cold."

    lawyer.add_function(get_weather)

    lawyer.receive_message("Hello, do you know what the weather is like?")
    # lawyer.receive_message("My cat is suing me, what should I do?")

    lawyer.next_message()

    print(lawyer.memory)


def generate_action_item():
    """
    Example of generating an action item from a message using a worker.
    """

    lawyer = Worker(
        name="Jerry",
        job="Lawyer",
        prompt="You are are talking to a client.",
    )

    print(
        "action item:",
        lawyer.generate_action_from_message(
            "Even though cats are not legal entities, you should still hire an attorney to represent you in court."
        ),
    )


if __name__ == "__main__":
    # user_speak_example()
    # generate_action_item()
    print(
        Message.convert_messages(
            Worker("Jerry", "Lawyer", "You are are talking to a client.").memory
        )
    )
