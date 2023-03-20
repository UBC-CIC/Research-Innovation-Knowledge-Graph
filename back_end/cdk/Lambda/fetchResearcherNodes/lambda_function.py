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
    colorObject = {
        "Faculty of Applied Science": "#A84D52", # Redwood
        "Faculty of Science": "#2E5090", # YInMn Blue
        "The Sauder School of Business": "#88BD56", # Pistachio
        "Faculty of Dentistry": "#00B8A2", # Keppel
        "Faculty of Arts": "#634581", # Ultra Violet
        "Faculty of Forestry": "#82470D", # Chocolate
        "Faculty of Land and Food Systems": "#ADA871", # Sage
        "Faculty of Education": "#025033", # Castleton green
        "Faculty of Pharmaceutical Sciences": "#DBB2D1", # Pink lavender
        
        "Peter A. Allard School of Law": "#F7CB78", # Jasmine
        "Faculty of Medicine": "#40AFD1", # Pacific cyan
    
        "VP Academic and Provost": "#989C9C", # other shade of grey
        "VP Research and Innovation": "#989C9C",
    
        "UBCO - Barber - Faculty of Science": "#A3A9AA", # some sort of grey (Cadet gray)
        "UBCO - Barber - Faculty of Arts and Social Sciences": "#A3A9AA",
        "UBCO - Faculty of Creative and Critical Studies": "#A3A9AA",
        "UBCO - Faculty of Health and Social Development": "#A3A9AA",
        "UBCO - Faculty of Management": "#A3A9AA",
    }
    
    
    credentials = getCredentials()
    connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
    cursor = connection.cursor()
    
    query = ""
    
    if len(event["arguments"]["facultiesToFilterOn"]) > 0 and len(event["arguments"]["keyword"]) > 0:
        queryData = []
        
        queryData.append(event["arguments"]["facultiesToFilterOn"])
        
        keywordList = event["arguments"]["keyword"].split(", ")
        
        query = "SELECT * FROM public.researcher_data WHERE prime_faculty=ANY(%s) AND ("
        
        for index, keyword in enumerate(keywordList):
            print(index)
            if index != len(keywordList) - 1:
                query = query + " keywords LIKE %s OR "
            else:
                query = query + " keywords LIKE %s "
            queryData.append("%"+keyword+"%")
        
        query = query + ") AND (scopus_id = ANY (SELECT source_id FROM public.edges_full) OR scopus_id = ANY (SELECT target_id FROM public.edges_full))"
        
        print(query)
        print(queryData)
        cursor.execute(query, (queryData))
    elif len(event["arguments"]["facultiesToFilterOn"]) > 0:
        cursor.execute("SELECT * FROM public.researcher_data WHERE prime_faculty=ANY(%s) AND (scopus_id = ANY (SELECT source_id FROM public.edges_full) OR scopus_id = ANY (SELECT target_id FROM public.edges_full))", (event["arguments"]["facultiesToFilterOn"],))
    elif len(event["arguments"]["keyword"]) > 0:
        queryData = []
        
        keywordList = event["arguments"]["keyword"].split(", ")
        
        query = "SELECT * FROM public.researcher_data WHERE ("
        
        for index, keyword in enumerate(keywordList):
            print(index)
            if index != len(keywordList) - 1:
                query = query + " keywords LIKE %s OR "
            else:
                query = query + " keywords LIKE %s "
            queryData.append("%"+keyword+"%")
        
        query = query + ") AND (scopus_id = ANY (SELECT source_id FROM public.edges_full) OR scopus_id = ANY (SELECT target_id FROM public.edges_full))"
        
        print(query)
        print(queryData)
        cursor.execute(query, (queryData))
    else:
        cursor.execute("SELECT * FROM public.researcher_data WHERE (scopus_id = ANY (SELECT source_id FROM public.edges_full) OR scopus_id = ANY (SELECT target_id FROM public.edges_full))")
    
    result = cursor.fetchall() #This command gets all the data you can fetch one as well
    
    researcherList = []
    #Key list is to make sure no duplicate ids are in the graph
    keyList = []
    
    for researcher in result:
        if researcher[8] not in keyList:
            researcherObject = {
                "key": researcher[8],
                "attributes": {
                    "label": researcher[1] + " " + researcher[2],
                    "email": researcher[3],
                    "rank": researcher[4],
                    "department": researcher[5],
                    "faculty": researcher[6],
                    "color": colorObject[researcher[6]],
                    "size": 0.1
                },
            }
            researcherList.append(researcherObject)
            keyList.append(researcher[8])

    cursor.close() #This ends the connection
    connection.commit() #This one makes any changes you made with queries commited
    
    return researcherList
