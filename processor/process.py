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

    #Getting the environment configs
    MODEL_PATH = os.environ.get("MODEL_PATH")
    EMBEDDING = os.environ.get("EMBEDDING")
    DOC_PATH = os.environ.get("DOC_PATH")
    PROMPT_YAML_PATH = os.environ.get("PROMPT_YAML_PATH")

    #Reading the query from the argument passed as an input
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', help='Query to be processed')
    args = parser.parse_args()
    query = args.input
     
    #Instantiation the agent to do the processing
    router = simplerouter.SimpleRouter()
    agent_list = agents.get_agent_list()
    agent = router.select_agent(agent_list)(
        MODEL_PATH,
        EMBEDDING,
        DOC_PATH,
        PROMPT_YAML_PATH)
    
    print(agent.perform(query))