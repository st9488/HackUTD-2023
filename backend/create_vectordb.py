from langchain.vectorstores import FAISS
from langchain.document_loaders import PDFMinerLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceBgeEmbeddings

if __name__ == "__main__":
    print("Loading embeddings model...")
    model_name = "BAAI/bge-small-en"
    model_kwargs = {"device": "cpu"}
    embeddings = HuggingFaceBgeEmbeddings(
        model_name=model_name, model_kwargs=model_kwargs
    )

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    pdf_doc = PDFMinerLoader("./research_papers/research_chatpgt.pdf").load()
    chunks = splitter.split_text(pdf_doc[0].page_content)
    list_of_documents: list[Document] = []

    for chunk in chunks:
        list_of_documents.append(Document(page_content=chunk))

    vector_store = FAISS.from_documents(list_of_documents, embedding=embeddings)
    vector_store.save_local("research_chatpgt.faiss")
