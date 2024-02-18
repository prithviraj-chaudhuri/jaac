from langchain_community.llms import LlamaCpp
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders.generic import GenericLoader
from langchain_community.document_loaders.parsers import LanguageParser
from langchain.text_splitter import Language
from langchain_core.prompts import PromptTemplate
from langchain.chains import StuffDocumentsChain, LLMChain, RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import yaml

class SimpleQa:

    #Initializing the llm, loader and the qa chain
    def __init__(self, model_path, embedding_model_name, docs_path, prompt_yaml_path):
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
        llm = LlamaCpp(
            model_path=model_path,
            temperature=0,
            max_tokens=2000,
            top_p=1,
            callback_manager=callback_manager,
            n_ctx=4096,
            verbose=True
        )
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model_name,
            model_kwargs={'device': 'cpu'}
        )
        self.loader_python = GenericLoader.from_filesystem(
            docs_path,
            glob="**/*",
            suffixes=[".py"],
            exclude=["**/non-utf8-encoding.py"],
            parser=LanguageParser(language=Language.PYTHON, parser_threshold=500),
        )

        with open(prompt_yaml_path, 'r') as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)

        prompt_template = data["simpleqa"]

        QA_CHAIN_PROMPT = PromptTemplate.from_template(prompt_template) 
        llm_chain = LLMChain(llm=llm, prompt=QA_CHAIN_PROMPT)

        document_prompt = PromptTemplate(
            input_variables=["page_content"],
            template="{page_content}"
        )
        self.chain = StuffDocumentsChain(
            llm_chain=llm_chain,
            document_prompt=document_prompt,
            document_variable_name="context"
        )

    #Loading and parsing the document in runtime when the query is called
    def perform(self, query):
        documents_python = self.loader_python.load()
        splitter_python = RecursiveCharacterTextSplitter.from_language(language=Language.PYTHON, chunk_size=2000, chunk_overlap=200)
        texts_python = splitter_python.split_documents(documents_python)

        db = Chroma.from_documents(texts_python, self.embeddings)
        retriever = db.as_retriever(search_kwargs={"k": 1})
        
        qa = RetrievalQA(
            combine_documents_chain=self.chain,
            callbacks=None,
            verbose=True,
            retriever=retriever,
            return_source_documents=True,
        )
        res = qa(query)
        return res['result']