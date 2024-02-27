from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 

import agents
from router import simplerouter
from datastore import chroma_store

app = Flask(__name__) 
api = Api(app) 

class Processor(Resource):

    def post(self): 
        data = request.get_json()
        model_path = data.get('model_path','')
        embedding = data.get('embedding','')
        db_path = data.get('db_path','')
        prompt_yaml_path = data.get('prompt_yaml_path','')
        query = data.get('query','')

        router = simplerouter.SimpleRouter()
        agent_list = agents.get_agent_list()
        agent = router.select_agent(agent_list)(
            model_path,
            embedding,
            db_path,
            prompt_yaml_path)

        response = {
            'answer': agent.perform(query)
        }

        return response, 201
    
api.add_resource(Processor, '/process')


class DataStore(Resource):

    def put(self): 
        data = request.get_json()
        embedding = data.get('embedding','')
        doc_path = data.get('doc_path','')
        db_path = data.get('db_path','')
        data_store = chroma_store.ChromaStore(embedding, doc_path, db_path)
        if data_store.listAllFiles(doc_path):
            response = {
                'message': "Data saved successfully"
            }
            return response, 201
        else:
            response = {
                'message': "Some error occured"
            }
            return response, 500
            
api.add_resource(DataStore, '/data')



if __name__ == '__main__': 
    app.run(debug = False) 