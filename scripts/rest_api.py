from flask import Flask

app = Flask(__name__)

@app.route('/nodes', methods=['GET'])
def get_nodes():
    with open('nodes.json', 'r') as nodes_file:
        return nodes_file.read()

@app.route('/adjacency', methods=['GET'])
def get_adjacency():
    with open('adjacency.json', 'r') as adj_file:
        return adj_file.read()