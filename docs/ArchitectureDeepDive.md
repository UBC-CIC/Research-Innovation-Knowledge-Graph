# Backend and Frontend Stack Deep Dive

## Architecture

![Alt text](./images/KnowledgeGraphArchitecture.png?raw=true "Architecture")

## Description

<strong>1.</strong> The S3 bucket stores csv files that contain data that will be put into the RDS Postgresql database.

<strong>2.</strong> The glue job interacts with the s3 bucket storing the researcher csv data and puts the data into the database.

<strong>3.</strong> When queried, Lambda connects to the RDS PostgreSQL database and gets the data requested by AppSync.

<strong>4.</strong> AWS AppSync triggers the PostgreSQL Lambda and passes the correct variables needed to get the required data.

<strong>5.</strong> When an autheticated user interacts with the website queries will be sent to AWS appsync to get data to show on the website.

<strong>6.</strong> This connection represents the user interacting with the knowledge graph website hosted on AWS amplify.

## Lambda Functions Deep Dive

![Alt text](./images/KowledgeGraphLambdaDeepDive.png?raw=true "Lambda Architecture")

<strong>getAllFaculties: </strong>

<strong>getSharedPublications:</strong>

<strong>getSimilarResearchers:</strong>

<strong>fetchResearcherInformation:</strong>

<strong>fetchResearcherNodes:</strong>

<strong>fetchEdgesFromPostgres:</strong>

