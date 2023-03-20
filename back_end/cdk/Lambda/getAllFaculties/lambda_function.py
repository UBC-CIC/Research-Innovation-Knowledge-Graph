import json
import boto3
import psycopg2

sm_client = boto3.client('secretsmanager')

#This function gets the credentials for the databae
def getCredentials():
    credentials = {}

    response = sm_client.get_secret_value(SecretId='')
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
    
    cursor.execute("SELECT DISTINCT prime_faculty FROM researcher_data")
        
    result = cursor.fetchall() #This command gets all the data you can fetch one as well
    
    facultyList = []
    
    for faculty in result:
        facultyList.append(faculty[0])
        
    facultyList.sort()
    
    cursor.close() #This ends the connection
    connection.commit() #This one makes any changes you made with queries commited
    
    return facultyList