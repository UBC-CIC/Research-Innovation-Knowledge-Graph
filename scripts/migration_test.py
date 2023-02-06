import psycopg2
import json

from config import config
from util import SetEncoder

researcher_columns_no_keywords = 'first_name, last_name, email, rank, prime_department, prime_faculty, scopus_id'

def main():
    params = config()
    connection = psycopg2.connect(**params)
    
    nodes = {} # dict: scopus_id -> Researcher
    adjacency_list = {} # dict: scopus_id -> dict: scopus_id -> set: publication_ids
    edge_counts = {} # dict: scopus_id -> int

    apsc_scopus_ids = fetch_researchers_from_faculty(
                        connection, 'scopus_id', 'Faculty of Applied Science', 25)

    print(apsc_scopus_ids)
    
    for row in apsc_scopus_ids:
        scopus_id = row[0]

        # get all publications of this researcher
        author_ids_rows = fetch_publications_of_researcher_with_id(connection, 'id, author_ids', scopus_id)

        valid_ids = []
        if author_ids_rows is not None:
            for row in author_ids_rows:
                publication_id = row[0]
                author_ids_list = row[1]
                for id in author_ids_list:
                    if id not in nodes:
                        # fetch from researcher_data, create new node
                        results = fetch_researcher_with_scopus_id(connection, researcher_columns_no_keywords, id)
                        if len(results) == 0:
                            continue

                        author_data = results[0]
                        
                        new_author_id = author_data[6]
                        nodes[new_author_id] = author_data

                        # new_node = Researcher(author_data)
                        # nodes[new_node.scopus_id] = new_node
                        
                        valid_ids.append(new_author_id)
                    else:
                        valid_ids.append(id)
            
            for i in range(len(valid_ids) - 1):
                for j in range(i + 1, len(valid_ids)):
                    author_a_id = valid_ids[i]
                    author_b_id = valid_ids[j]

                    if author_a_id == author_b_id:
                        continue
                    elif author_a_id > author_b_id:
                        # swap
                        temp = author_a_id
                        author_a_id = author_b_id
                        author_b_id = temp
                    
                    add_a_to_b_edge(adjacency_list, edge_counts, author_a_id, author_b_id, publication_id)

    # print(json.dumps(nodes))
    # print(json.dumps(adjacency_list, sort_keys=True, indent=4, cls=SetEncoder))

    print(f'Nodes length: {len(nodes)}')
    print(f'AdjList length: {len(adjacency_list)}')

    nodes_json = json.dumps(nodes)
    adjacency_json = json.dumps(adjacency_list, sort_keys=True, indent=4, cls=SetEncoder)
    edge_counts_json = json.dumps(edge_counts)

    # print(edge_counts_json)

    write_to_json_file(nodes_json, "nodes.json")
    write_to_json_file(adjacency_json, "adjacency.json")
    write_to_json_file(edge_counts_json, "edge_counts.json")
        

    # fetch first 100 researchers from a faculty
    # for each one, get all their publications
    # for list of author_ids in list
        # fetch this author_id from researcher_data
        # add a node to our graph
        # double for loop author_ids of publication
            # sort based on author_id, create edge
            # adjacency list using a map of 

def add_a_to_b_edge(adj_list, edge_counts, a_id, b_id, publication_id):
    if a_id not in adj_list:
        adj_list[a_id] = {}
    
    a_adj_dict = adj_list[a_id]
    if b_id not in a_adj_dict:
        a_adj_dict[b_id] = set()
    
    if publication_id not in a_adj_dict[b_id]:
        a_adj_dict[b_id].add(publication_id)
        increment_edge_count_for_researcher(edge_counts, a_id)
        increment_edge_count_for_researcher(edge_counts, b_id)
    
def increment_edge_count_for_researcher(edge_counts, scopus_id):
    if scopus_id not in edge_counts:
        edge_counts[scopus_id] = 0
    edge_counts[scopus_id] += 1

def perform_query(db_connection, query):
    cursor = db_connection.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    return results

def fetch_publications_of_researcher_with_id(db_connection, fields, scopus_id):
    query = f'''SELECT {fields} 
                FROM publication_data
                WHERE \'{scopus_id}\' = ANY(author_ids);'''
    return perform_query(db_connection, query)

def fetch_researcher_with_scopus_id(db_connection, fields, scopus_id):
    query = f'''SELECT {fields} 
                FROM researcher_data
                WHERE scopus_id = \'{scopus_id}\';'''
    return perform_query(db_connection, query)

def fetch_researchers_from_faculty(db_connection, fields, faculty, limit_rows):
    query = f'''SELECT {fields} 
                FROM researcher_data 
                WHERE prime_faculty = \'{faculty}\' LIMIT {limit_rows};'''
    return perform_query(db_connection, query)

def write_to_json_file(json_object, path):
    with open(path, 'w') as outfile:
        outfile.write(json_object)

# main()
# for each row
    # for each author_id pair (a, b)
        # if either not seen before, add to known authors
        # add a -> b connection, where a is always smaller than b
        # if seen before, add connection to this id
        # else, create a new author and add to list (fetching data from researcher_data)
        # 

# a - b
# a: [... b: 3]

# graph storage
# adjacency list



# what if only store a -> b

# double for loop
# for i in range(0, end)
    # for j in range(i + 1, end)
        # will only produce unique ones
