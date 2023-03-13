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

<strong>getAllFaculties: </strong> The get faculties Lambda function returns a list of all the unique faculties in the database.

<strong>getSharedPublications:</strong> The get shared publications Lambda has two inputs the ids of the two researchers. The Lambda then returns a list of publications that they share.

<strong>fetchResearcherInformation:</strong> The fetch researcher information Lambda has one input the id of the researcher. The Lambda then return the researchers information.

<strong>fetchResearcherNodes:</strong> The fetch researcher nodes Lambda takes two inputs an array of faculties to filter on and the keywords to filter on. The Lambda then returns all the researcher nodes that meet the filters given as an input.

<strong>fetchEdgesFromPostgres:</strong> The fetch edges from postgres Lambda takes two inputs an array of faculties to filter on and the keywords to filter on. The Lambda then returns all the edges nodes that meet the filters given as an input.

