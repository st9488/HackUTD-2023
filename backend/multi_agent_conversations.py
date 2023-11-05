from typing import List
from worker import Worker, Message, MultiAgentConversation


def main():
    jerry = Worker(
        name="Jerry",
        job="Lawyer",
        prompt="You are are talking to a client.",
    )
    larry = Worker(
        name="Larry",
        job="Marketing Manager",
        prompt="You are talking to the user, and you are in charge of marketing.",
    )
    george = Worker(
        name="George",
        job="CEO",
        prompt="You are talking to the user.",
    )

    conversation = MultiAgentConversation([jerry, larry, george], conversation_goal="")

    for i in range(6):
        conversation.iterate()

    print(jerry.memory, "\n")
    print(george.memory, "\n")
    print(larry.memory, "\n")


if __name__ == "__main__":
    main()
