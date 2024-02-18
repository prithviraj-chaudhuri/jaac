"""
This class parses user input and selects which class to load
for processing from the agents package
"""
class SimpleRouter:

    def __init__(self):
        pass

    def select_agent(self, agent_list):
        return agent_list[0]