import agents
from router import simplerouter

if __name__ == "__main__":
     
    router = simplerouter.SimpleRouter()
    agent_list = agents.get_agent_list()
    agent = router.select_agent(agent_list)(
        "models/nous-hermes-llama-2-7b.q4_0.gguf",
        "sentence-transformers/all-MiniLM-L6-v2",
        "docs",
        "conf/prompts.yaml")
    print(agent.perform("What does the print_argument annotation do?"))