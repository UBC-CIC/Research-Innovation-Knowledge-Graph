import psycopg2;
import json

from config import config;
from researcher import Researcher

researcher_columns_no_keywords = 'first_name, last_name, email, rank, prime_department, prime_faculty, scopus_id'

def main():
    params = config()
    connection = psycopg2.connect(**params)
    
    nodes = {} # dict: scopus_id -> Researcher
    adjacency_list = {} # dict: scopus_id -> dict: scopus_id -> count

    apsc_scopus_ids = fetch_researchers_from_faculty(
                        connection, 'scopus_id', 'Faculty of Applied Science', 10)

    print(apsc_scopus_ids)
    
    for row in apsc_scopus_ids:
        scopus_id = row[0]

        # get all publications of this researcher
        author_ids = fetch_publications_of_researcher_with_id(connection, 'author_ids', scopus_id)

        if author_ids is not None:
            for row in author_ids:
                author_id = row[0]

                if author_id not in nodes:
                    # fetch from researcher_data, create new node
                    results = fetch_researcher_with_scopus_id(connection, researcher_columns_no_keywords, author_id)
                    author_data = results[0]
                    new_node = Researcher(author_data)
                    nodes[new_node.scopus_id] = new_node
            
            for i in range(len(author_ids) - 1):
                for j in range(i + 1, len(author_ids)):
                    author_a_id = author_ids[i][0]
                    author_b_id = author_ids[j][0]
                    
                    if author_a_id > author_b_id:
                        # swap
                        temp = author_a_id
                        author_a_id = author_b_id
                        author_b_id = temp
                    
                    add_a_to_b_edge(adjacency_list, author_a_id, author_b_id)

    print(nodes)
    print(json.dumps(adjacency_list, sort_keys=True, indent=4))
        

    # fetch first 100 researchers from a faculty
    # for each one, get all their publications
    # for list of author_ids in list
        # fetch this author_id from researcher_data
        # add a node to our graph
        # double for loop author_ids of publication
            # sort based on author_id, create edge
            # adjacency list using a map of 

def add_a_to_b_edge(adj_list, a_id, b_id):
    if a_id not in adj_list:
        adj_list[a_id] = {}
    
    a_adj_dict = adj_list[a_id]
    if b_id in a_adj_dict:
        a_adj_dict[b_id] += 1
    else:
        a_adj_dict[b_id] = 1
    

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



main()
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
