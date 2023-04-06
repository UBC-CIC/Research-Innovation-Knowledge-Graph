import boto3
import psycopg2
import json

sm_client = boto3.client('secretsmanager')

def getCredentials():
    credentials = {}

    response = sm_client.get_secret_value(SecretId='knowledgeGraph/credentials/databaseCredentials')
    secrets = json.loads(response['SecretString'])
    credentials['username'] = secrets['username']
    credentials['password'] = secrets['password']
    credentials['host'] = secrets['host']
    credentials['db'] = secrets['dbname']
    return credentials

'''
Given a table name and a list of columns created using createColumn, returns a postgres query to create a table called table_name
with columns as defined in the columns list
'''
def createQuery(table_name, columns):
    query = 'CREATE TABLE IF NOT EXISTS public.' + table_name + ' ('
    for column in columns:
        query = query + column
    query = query + ');'
    return query

'''
Given a column_name, data type, constraints(eg. NOT NULL), and a boolean detailing whether the column is the last one to be added,
Returns a column section of a postgres create table query which can be fed into createQuery
'''        
def createColumn(column_name, columnType, constraints, final_column):
    column = column_name + ' ' + columnType + ' ' + constraints
    if not final_column:
        column = column + ', '
    return column

def lambda_handler(event, context):
    credentials = getCredentials()
    connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
    cursor = connection.cursor()

    

    #Add extension to create UUID Fields
    query = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
    cursor.execute(query)

    # Create Researcher Data Table
    columns = []
    #Added our controlled uuid to database table creation
    columns.append(createColumn('researcher_id', 'uuid', 'DEFAULT uuid_generate_v4() PRIMARY KEY', False))
    columns.append(createColumn('first_name', 'character varying', '', False))
    columns.append(createColumn('last_name', 'character varying', '', False))
    columns.append(createColumn('email', 'character varying', '', False))
    columns.append(createColumn('rank', 'character varying', '', False))
    columns.append(createColumn('prime_department', 'character varying', '', False))
    columns.append(createColumn('prime_faculty', 'character varying', '', False))
    columns.append(createColumn('scopus_id', 'character varying', '', False))
    columns.append(createColumn('keywords', 'character varying', '(10000000)', False))
    columns.append(createColumn('last_updated', 'character varying', '', True))
    query = createQuery('researcher_data', columns)
    cursor.execute(query)
    
    # Create Elsevier Data Table
    columns = []
    columns.append(createColumn('id', 'character varying', 'NOT NULL PRIMARY KEY', False))
    columns.append(createColumn('num_citations', 'integer', '', False))
    columns.append(createColumn('num_documents', 'integer', '', False))
    columns.append(createColumn('h_index', 'double precision', '', False))
    columns.append(createColumn('orcid_id', 'character varying', '', False))
    columns.append(createColumn('last_updated', 'character varying', '', True))
    query = createQuery('elsevier_data', columns)
    cursor.execute(query)
    
    # Create Publication Data Table
    columns = []
    columns.append(createColumn('id', 'character varying', 'NOT NULL PRIMARY KEY', False))
    columns.append(createColumn('title', 'character varying', '', False))
    columns.append(createColumn('journal', 'character varying', '', False))
    columns.append(createColumn('cited_by', 'integer', '', False))
    columns.append(createColumn('year_published', 'character varying', '', False))
    columns.append(createColumn('author_ids', 'character varying[]', '', False))
    columns.append(createColumn('author_names', 'character varying', '', False))
    columns.append(createColumn('keywords', 'character varying', '', False))
    columns.append(createColumn('doi', 'character varying', '', False))
    columns.append(createColumn('link', 'character varying', '', False))
    columns.append(createColumn('last_updated', 'character varying', '', True))
    query = createQuery('publication_data', columns)
    cursor.execute(query)
    
    # Create Edges Table
    columns = []
    columns.append(createColumn('source_id', 'character varying', '', False))
    columns.append(createColumn('target_id', 'character varying', '', False))
    columns.append(createColumn('publication_ids', 'text ARRAY', '', False))
    columns.append(createColumn('num_publications', 'integer', '', False))
    columns.append(createColumn('last_updated', 'character varying', '', True))
    query = createQuery('edges_full', columns)
    cursor.execute(query)
    
    # Create Potential Edges Table
    columns = []
    columns.append(createColumn('source_id', 'text', '', False))
    columns.append(createColumn('target_id', 'text', '', False))
    columns.append(createColumn('shared_keywords', 'text ARRAY', '', False))
    columns.append(createColumn('last_updated', 'character varying', '', True))
    query = createQuery('potential_edges', columns)
    cursor.execute(query)

    cursor.close()
    connection.commit()
    