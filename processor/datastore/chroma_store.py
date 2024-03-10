from langchain.embeddings import HuggingFaceEmbeddings
from langchain.document_loaders.directory import DirectoryLoader
from langchain.document_loaders.text import TextLoader
from langchain.text_splitter import Language
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.chroma import Chroma


EXTENSION2LANGUAGE = {
    "py": Language.PYTHON,
    "js": Language.JS,
    "html": Language.HTML,
    "php": Language.PHP,
    # Add others...
}


class ChromaStore:

    def __init__(self, embedding_model_name, doc_path, db_path):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model_name,
            model_kwargs={'device': 'cpu'}
        )
        loader_kwargs = {"autodetect_encoding": True}
        self.loader = DirectoryLoader(
            path=doc_path,
            glob="**/*",
            show_progress=True,
            loader_cls=TextLoader,
            loader_kwargs=loader_kwargs,
            exclude=["**/non-utf8-encoding.py"],
        )
        self.db = Chroma(persist_directory=db_path)
        
    def updateStore(self):
        documents = self.loader.load()
        extension2docs = {}
        for doc in documents:
            extension = doc.metadata["source"].split(".")[-1]
            doc.metadata["extension"] = extension
            if extension not in extension2docs:
                extension2docs[extension] = []
            extension2docs[extension].append(doc)
        split_texts = []
        for extension, docs in extension2docs.items():
            language = EXTENSION2LANGUAGE.get(extension, None)
            if language is None:
                splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
            else:
                splitter = RecursiveCharacterTextSplitter.from_language(language=language, chunk_size=2000, chunk_overlap=200)
            texts = splitter.split_documents(docs)
            split_texts.extend(texts)
        try:
            self.db.from_documents(split_texts, self.embeddings)
            return True
        except Exception:
            return False
