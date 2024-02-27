from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders.generic import GenericLoader
from langchain_community.document_loaders.parsers import LanguageParser
from langchain.text_splitter import Language
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import os

class ChromaStore:

    def __init__(self, embedding_model_name, doc_path, db_path):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model_name,
            model_kwargs={'device': 'cpu'}
        )
        self.loader_python = GenericLoader.from_filesystem(
            doc_path,
            glob="**/*",
            suffixes=[".py"],
            exclude=["**/non-utf8-encoding.py"],
            parser=LanguageParser(language=Language.PYTHON, parser_threshold=500),
        )
        self.db = Chroma(persist_directory=db_path)

    def updateStore(self):
        documents_python = self.loader_python.load()
        splitter_python = RecursiveCharacterTextSplitter.from_language(language=Language.PYTHON, chunk_size=2000, chunk_overlap=200)
        texts_python = splitter_python.split_documents(documents_python)
        try:
            self.db.from_documents(texts_python, self.embeddings)
            return True
        except Exception:
            return False
        
    def listAllFiles(self, doc_path):
        for root, _, files in os.walk(doc_path):
            for file in files:
                file_path = os.path.join(root, file)
                if '.git' not in file_path and '.vscode' not in file_path and 'node_modules' not in file_path and 'target' not in file_path and '.DS_Store' not in file_path:
                    print(file_path)

        return True
