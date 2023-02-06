import psycopg2
import json

from config import config
from migration_test import perform_query

def main():
    params = config()
    connection = psycopg2.connect(**params)

    with open('nodes.json', 'r') as nodes_json, open('adjacency.json', 'r') as adj_json, open('edge_counts.json', 'r') as edge_json:
        nodes = json.load(nodes_json)
        adjacency = json.load(adj_json)
        edge_counts = json.load(edge_json)

        for source_id in adjacency:
            targets_map = adjacency[source_id]

            for target_id in targets_map:
                shared_pubs = targets_map[target_id]
                insert_edge(connection, source_id, target_id, shared_pubs)

def insert_edge(db_connection, source_id, target_id, publications):
    query = f'''INSERT INTO edges_demo
                (source_id, target_id, publication_ids)
                VALUES (
                    {source_id},
                    {target_id},
                    {publication_list_to_sql_str(publications)}
                );
    '''
    perform_query(db_connection, query)


def publication_list_to_sql_str(pub_list):
    return 'ARRAY' + '[' + ', '.join(f'\'{pub}\'' for pub in pub_list) + ']'


main()



