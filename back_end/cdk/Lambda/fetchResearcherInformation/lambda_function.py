import json
import boto3
import psycopg2

sm_client = boto3.client('secretsmanager')

#This function gets the credentials for the databae
def getCredentials():
    credentials = {}

    response = sm_client.get_secret_value(SecretId='knowledgeGraph/credentials/databaseCredentials')
    secrets = json.loads(response['SecretString'])
    credentials['username'] = secrets['username']
    credentials['password'] = secrets['password']
    credentials['host'] = secrets['host']
    credentials['db'] = secrets['dbname']
    return credentials

def lambda_handler(event, context):
    credentials = getCredentials()
    connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
    cursor = connection.cursor()
    
    query = "SELECT * FROM researcher_data WHERE scopus_id = '" + event["arguments"]["id"] + "'" #SQL Query
    cursor.execute(query) #This runs the query
    result = cursor.fetchone() #This command gets all the data you can fetch one as well
    
    returnedResult = {
        "id": result[8],
        "firstName": result[1],
        "lastName": result[2],
        "email": result[3],
        "rank": result[4],
        "department": result[5],
        "faculty": result[6],
        "keywords": result[7],
    }

    cursor.close() #This ends the connection
    connection.commit() #This one makes any changes you made with queries commited

    return returnedResult