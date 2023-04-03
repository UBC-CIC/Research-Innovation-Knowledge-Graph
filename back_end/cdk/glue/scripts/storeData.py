import sys
import boto3
import psycopg2
import json
import time
import io
import pandas as pd
from botocore.client import Config

sm_client = boto3.client('secretsmanager')
config = Config(connect_timeout=5, retries={'max_attempts': 0})
s3 = boto3.client('s3', config=config)
config = Config(connect_timeout=5, retries={'max_attempts': 0})
s3 = boto3.resource('s3', config=config)

def getCredentials():
    credentials = {}

    response = sm_client.get_secret_value(SecretId='vpri/credentials/dbCredentials')
    secrets = json.loads(response['SecretString'])
    credentials['username'] = secrets['username']
    credentials['password'] = secrets['password']
    credentials['host'] = secrets['host']
    credentials['db'] = secrets['dbname']
    return credentials
    
def fetchFromS3(bucket, key):

    # get the raw csv file from S3
    s3_bucket_raw = s3.Object(bucket, key)   
    response = s3_bucket_raw.get()

    # extract the raw data from the response Body
    raw_data_from_s3 = response["Body"]

    return io.StringIO(raw_data_from_s3.read().decode("utf-8"))
    
def insertIntoElsevierTable(scopus_id, num_citations, num_documents, h_index, orcid_id, last_updated, cursor):
    queryline1 = "INSERT INTO public.elsevier_data(id, num_citations, num_documents, h_index, orcid_id, last_updated) "
    queryline2 = "VALUES ('" + scopus_id + "', " + num_citations + ", " + num_documents + ", " + h_index + ", '" + orcid_id + "', '" + last_updated + "')"
    cursor.execute(queryline1 + queryline2)
    
def insertIntoPublicationTable(id, title, keywords, author_ids, author_names, journal, cited_by, year_published, link, doi, last_updated,  cursor):
    queryline1 = "INSERT INTO public.publication_data(id, title, keywords, author_ids, author_names, journal, cited_by, year_published, link, doi, last_updated) "
    queryline2 = "VALUES ('" + id + "', '" + title + "', '" + keywords + " ', '" + author_ids + "', " + author_names + "', '" + journal + "', '" + cited_by + "', '" + year_published + "', '" + link + "', '" + doi + "', '" + last_updated + "')"
    cursor.execute(queryline1 + queryline2)
    
def handleElsevierData(cursor):
    #Insert into elsiver
    raw_data = fetchFromS3("rds-reforming-bucket", "elsevier_data.csv")
    print('hi')
    # read raw data into a pandas DataFrame
    df = pd.read_csv(raw_data)
    # i = 1
    # for index, row in df.iterrows():
    #     insertIntoElsevierTable(str(row['id']), str(row['num_citations']), str(row['num_documents']), str(row['h_index']), str(row['orchid_id']), str(row['last_updated']), cursor)
    #     print(i)
    #     i = i + 1
    # print("hi again")
    
def handlePublicationData(cursor):
    #Insert into elsiver
    raw_data = fetchFromS3("rds-reforming-bucket", "publication_data.csv")
    print('hi')
    # read raw data into a pandas DataFrame
    df = pd.read_csv(raw_data)
    for index, row in df.iterrows():
        publication = {}
        print('here')
        publication['id'] = str(row['id'])
        publication['doi'] = str(row['doi'])
        publication['title'] = str(row['title']).replace('\'', "''")
        publication['author_ids'] = str(row['author_ids']).replace('\'', '"').replace('[', '{').replace(']', '}')
        publication['author_names'] = str(row['author_names']).replace(" '", " ").replace("',", ",").replace("'", "''")
        publication['keywords'] = str(row['keywords']).replace(" '", " ").replace("',", ",").replace("'", "''")
        publication['journal'] = str(row['journal']).replace("'", "''")
        publication['cited_by'] = str(row['cited_by'])
        publication['year_published'] = str(row['year_published'])
        publication['link'] = str(row['link'])
        publication['last_updated'] = str(row['last_updated'])
        queryline1 = "INSERT INTO public.publication_data(id, doi, title, author_ids, author_names, keywords, journal, cited_by, year_published, link, last_updated) "
        queryline2 = "VALUES ('" + publication['id'] + "', '" + publication['doi'] + "', '" + publication['title'] + "', '" + publication['author_ids'] + "', '" + publication['author_names'] + "', '" + publication['keywords'] + "', '" + publication['journal'] + "', '" + publication['cited_by'] + "', '" + publication['year_published'] + "', '" + publication['link'] + "', '" + publication['last_updated'] + "')"
        queryline3 = "ON CONFLICT (id) DO UPDATE "
        queryline4 = "SET doi='" + publication['doi'] + "', title='" + publication['title'] + "', author_ids='" + publication['author_ids'] + "', author_names='" + publication['author_names'] + "', journal='" + publication['journal'] + "', year_published='" + publication['year_published'] + "', cited_by='" + publication['cited_by'] + "', keywords='" + publication['keywords'] + "', link='" + publication['link'] + "', last_updated='" + publication['last_updated'] + "'"
        cursor.execute(queryline1 + queryline2 + queryline3 + queryline4)
    print("hi again")    

def handleResearcherData(cursor):
    #Insert into elsiver
    raw_data = fetchFromS3("rds-reforming-bucket", "researcherData.csv")
    print('hi')
    # read raw data into a pandas DataFrame
    df = pd.read_csv(raw_data)
    for index, row in df.iterrows():
        researcher = {}
        print('here')
        researcher['id'] = str(row['id'])
        researcher['first_name'] = str(row['first_name']).replace(" '", " ").replace("',", ",").replace("'", "''")
        researcher['last_name'] = str(row['last_name']).replace(" '", " ").replace("',", ",").replace("'", "''")
        researcher['email'] = str(row['email'])
        researcher['rank'] = str(row['rank']).replace(" '", " ").replace("',", ",").replace("'", "''")
        researcher['prime_department'] = str(row['prime_department']).replace(" '", " ").replace("',", ",").replace("'", "''")
        researcher['prime_faculty'] = str(row['prime_faculty']).replace(" '", " ").replace("',", ",").replace("'", "''")
        researcher['keywords'] = str(row['keywords']).replace(" '", " ").replace("',", ",").replace("'", "''")
        researcher['scopus_id'] = str(row['scopus_id'])
        queryline1 = "INSERT INTO public.researcher_data(researcher_id, first_name, last_name, email, rank, prime_department, prime_faculty, keywords, scopus_id) "
        queryline2 = "VALUES ('" + researcher['id'] + "', '" + researcher['first_name'] + "', '" + researcher['last_name'] + "', '" + researcher['email'] + "', '" + researcher['rank'] + "', '" + researcher['prime_department'] + "', '" + researcher['prime_faculty'] + "', '" + researcher['keywords'] + "', '" + researcher['scopus_id'] + "')"
        cursor.execute(queryline1 + queryline2)
    print("hi again")    
    
def checkElsevierInsert(cursor):
    query = "drop table researcher_data"
    cursor.execute(query)
    query = "drop table elsevier_data"
    cursor.execute(query)
    query = "drop table orcid_data"
    cursor.execute(query)
    query = "drop table publication_data"
    cursor.execute(query)
    query = "drop table data_update_logs"
    cursor.execute(query)
    query = "drop table update_publications_logs"
    cursor.execute(query)
    query = "drop table grant_data"
    cursor.execute(query)
    

def checkPublicationInsert(cursor):
    query = "SELECT * FROM publication_data"
    cursor.execute(query)
    result = cursor.fetchall()
    print(result)
    
credentials = getCredentials()
connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
cursor = connection.cursor()
handleElsevierData(cursor)
# checkElsevierInsert(cursor)
handlePublicationData(cursor)
handleResearcherData(cursor)
cursor.close()
connection.commit()