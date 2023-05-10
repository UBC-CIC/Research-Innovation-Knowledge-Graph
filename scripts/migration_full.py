import psycopg2
import json

from config import config
from util import SetEncoder

researcher_columns_no_keywords = 'first_name, last_name, email, rank, prime_department, prime_faculty, scopus_id'

def main():
    params = config()
    connection = psycopg2.connect(**params)
    
    adjacency_list = {} # dict: scopus_id -> dict: scopus_id -> set: publication_ids
    edge_counts = {} # dict: scopus_id -> int

    all_publications = fetch_all_publications(connection, 'id, author_ids')

    print(len(all_publications))

    for row in all_publications:
        pub_id = row[0]
        author_ids = row[1]

        valid_ids = []
        for id in author_ids:
            results = fetch_researcher_with_scopus_id(connection, 'scopus_id', id, 1)
            if len(results) == 0:
                continue
            valid_ids.append(results[0][0])
        
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
                add_a_to_b_edge(adjacency_list, edge_counts, author_a_id, author_b_id, pub_id)
    
    for source_id in adjacency_list:
        targets_map = adjacency_list[source_id]
        for target_id in targets_map:
            shared_pubs = targets_map[target_id]
            insert_edge(connection, source_id, target_id, shared_pubs)


    # adjacency_json = json.dumps(adjacency_list, sort_keys=True, indent=4, cls=SetEncoder)
    # edge_counts_json = json.dumps(edge_counts)
    # write_to_json_file(adjacency_json, "adjacency_new.json")
    # write_to_json_file(edge_counts_json, "edge_counts_new.json")


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

def fetch_all_publications(db_connection, fields, limit_rows=None):
    query = f'''SELECT {fields} 
                FROM publication_data'''
    
    if limit_rows is None:
        query = query + ';'
    else:
        query = query + f' LIMIT {limit_rows};'
    
    return perform_query(db_connection, query)

def fetch_researcher_with_scopus_id(db_connection, fields, scopus_id, limit_rows):
    query = f'''SELECT {fields} 
                FROM researcher_data
                WHERE scopus_id = \'{scopus_id}\'
                LIMIT {limit_rows};'''
    return perform_query(db_connection, query)

def fetch_researchers_from_faculty(db_connection, fields, faculty, limit_rows):
    query = f'''SELECT {fields} 
                FROM researcher_data 
                WHERE prime_faculty = \'{faculty}\' LIMIT {limit_rows};'''
    return perform_query(db_connection, query)

def write_to_json_file(json_object, path):
    with open(path, 'w') as outfile:
        outfile.write(json_object)

def insert_edge(db_connection, source_id, target_id, publications):
    query = f'''INSERT INTO edges_full
                (source_id, target_id, publication_ids)
                VALUES (
                    {source_id},
                    {target_id},
                    {publication_list_to_sql_str(publications)}
                );
    '''
    perform_insert_query(db_connection, query)

def perform_insert_query(db_connection, query):
    cursor = db_connection.cursor()
    cursor.execute(query)
    db_connection.commit()

def publication_list_to_sql_str(pub_list):
    return 'ARRAY' + '[' + ', '.join(f'\'{pub}\'' for pub in pub_list) + ']'

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
