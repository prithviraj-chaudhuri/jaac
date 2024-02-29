from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders.generic import GenericLoader
from langchain_community.document_loaders.parsers import LanguageParser
from langchain.text_splitter import Language
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import os

language_map = {
    'py'    : Language.PYTHON,
    'java'  : Language.JAVA,
    'html'  : Language.HTML,
    'js'   : Language.JS
}

class ChromaStore:

    def __init__(self, embedding_model_name, doc_path, db_path):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model_name,
            model_kwargs={'device': 'cpu'}
        )
        self.db = Chroma(persist_directory=db_path)
        
    def updateStore(self, doc_path, extensions):
        for root, _, files in os.walk(doc_path):
            for file in files:
                file_path = os.path.join(root, file)
                extension = file_path.split('.')[-1]
                found_extensions = set()
                if extension in extensions:
                    found_extensions.add(extension)

        for extension in found_extensions:
            loader = GenericLoader.from_filesystem(
                doc_path,
                glob='**/*.'+extension,
                suffixes=['.'+extension],
                parser=LanguageParser(language=language_map[extension], parser_threshold=500)
            )
            documents= loader.load()
            splitter = RecursiveCharacterTextSplitter.from_language(language=language_map[extension], chunk_size=2000, chunk_overlap=200)
            texts = splitter.split_documents(documents)
            try:
                self.db.from_documents(texts, self.embeddings)
            except Exception:
                return False    
        return True
