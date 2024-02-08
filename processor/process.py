import argparse
import agents
from router import simplerouter

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", help="The input from the extension")
    args = parser.parse_args()
    
    router = simplerouter.SimpleRouter()
    agent_list = agents.get_agent_list()
    agent = router.select_agent(args.input, agent_list)
    print(agent.perform())