# Backend and Frontend Stack Deep Dive

## Architecture

![Alt text](./images/KnowledgeGraphArchitecture.png?raw=true "Architecture")

## Description

1. The S3 bucket stores csv files that contain data that will be put into the RDS Postgresql database.

2. The glue job interacts with the s3 bucket storing the researcher csv data and puts the data into the database.

3. When queried, Lambda connects to the RDS PostgreSQL database and gets the data requested by AppSync.

4. AWS AppSync triggers the PostgreSQL Lambda and passes the correct variables needed to get the required data.

5. When an autheticated user interacts with the website queries will be sent to AWS appsync to get data to show on the website.

6. This connection represents the user interacting with the knowledge graph website hosted on AWS amplify.

## Lambda Functions Deep Dive

![Alt text](./images/KowledgeGraphLambdaDeepDive.png?raw=true "Lambda Architecture")

getAllFaculties: 

getSharedPublications:

getSimilarResearchers:

fetchResearcherInformation:

fetchResearcherNodes:

fetchEdgesFromPostgres:

