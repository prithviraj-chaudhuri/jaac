from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 

import agents
from router import simplerouter

app = Flask(__name__) 
api = Api(app) 

class Processor(Resource):

    def post(self): 
        data = request.get_json()
        doc_path = data.get('doc_path','')
        model_path = data.get('model_path','')
        embedding = data.get('embedding','')
        prompt_yaml_path = data.get('prompt_yaml_path','')
        query = data.get('query','')

        router = simplerouter.SimpleRouter()
        agent_list = agents.get_agent_list()
        agent = router.select_agent(agent_list)(
            model_path,
            embedding,
            doc_path,
            prompt_yaml_path)

        response = {
            'answer': agent.perform(query)
        }

        return response, 201
  

api.add_resource(Processor, '/')

if __name__ == '__main__': 
    app.run(debug = False) 