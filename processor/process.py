import dotenv
import os
from os.path import join, dirname
import argparse

import agents
from router import simplerouter

if __name__ == "__main__":

    #Loading the environment variables
    dotenv_path = join(dirname(__file__), '../conf/.env')
    dotenv.load_dotenv(dotenv_path)

    #Reading the query from the argument passed as an input
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', help='Query to be processed')
    parser.add_argument('--doc', help='Folder containing the source code')
    parser.add_argument('--model_path', help='Path to the model hosted locally')
    parser.add_argument('--embedding', help='Embedding to use')
    parser.add_argument('--prompt_yaml_path', help='Prompt yaml path')
    args = parser.parse_args()
    query = args.input
    doc_path = args.doc

    if doc_path is None:
        doc_path = os.environ.get("DOC_PATH")
    model_path = args.model_path
    if model_path is None:
        model_path = os.environ.get("MODEL_PATH")
    embedding = args.embedding
    if embedding is None:
        embedding = os.environ.get("EMBEDDING")
    prompt_yaml_path = args.prompt_yaml_path
    if prompt_yaml_path is None:
        prompt_yaml_path = os.environ.get("PROMPT_YAML_PATH")

    #Instantiation the agent to do the processing
    router = simplerouter.SimpleRouter()
    agent_list = agents.get_agent_list()
    agent = router.select_agent(agent_list)(
        model_path,
        embedding,
        doc_path,
        prompt_yaml_path)
    
    print(agent.perform(query))