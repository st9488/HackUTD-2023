from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.vectorstores import FAISS

if __name__ == "__main__":
    db = FAISS.load_local(f"./note_database.faiss", embeddings=embeddings)

    results = db.max_marginal_relevance_search(
        "What are some of the best uses of ChatGPT?",
        k=5,
    )
