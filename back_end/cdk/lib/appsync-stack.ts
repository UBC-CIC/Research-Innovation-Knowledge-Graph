import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { VpcStack } from './vpc-stack';
import { aws_appsync as appsync } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib'
import { ArnPrincipal, Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { DatabaseStack } from './database-stack';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { LambdaStack } from './lambda-stack';

export class AppsyncStack extends Stack {
  constructor(scope: Construct, id: string, vpcStack: VpcStack, databaseStack: DatabaseStack, lambdaStack: LambdaStack,  props?: StackProps) {
    super(scope, id, props);

    // Get the API ID from paramter Store
    // During Amplify Deployment the APIID is stored in parameter store
    const APIID = ssm.StringParameter.fromStringParameterAttributes(this, 'KnowledgeGraphQLAPIIdOutput', {
      parameterName: 'KnowledgeGraphQLAPIIdOutput',
    }).stringValue;

    //Get default secuirty group
    const defaultSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, id, vpcStack.vpc.vpcDefaultSecurityGroup);

    // Create the postgresql db query function.
    /*
    const queryDbFunction = new lambda.Function(this, 'expertiseDashboard-postgresQuery', {
      functionName: "expertiseDashboard-postgresQuery",
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(300),
      role: lambdaRole,
      memorySize: 512,
      environment: {
          "SM_DB_CREDENTIALS": databaseStack.secretPath,
      },
      securityGroups: [ defaultSecurityGroup ],
      vpc: vpcStack.vpc,
      code: lambda.Code.fromAsset('./lambda/postgresQuery/'),
      layers: [postgresLayer]
    });

    */

    //Create Lamabda Service role for the Appsync datasources
    const appsyncLambdaServiceRole = new Role(this, 'appsyncLambdaServiceRole', {
      roleName: 'appsyncLambdaServiceRole',
        assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
        inlinePolicies: {
            additional: new PolicyDocument({
                statements: [
                    new PolicyStatement({
                        effect: Effect.ALLOW,
                        actions: [
                          //Lambda Invoke
                          "lambda:invokeFunction",
                        ],
                        resources: [queryDbFunction.functionArn]
                    })
                ]
            }),
        },
    });

    //Create PostgreSQL Appsync Data Source
    const postgresqlDataSource = new appsync.CfnDataSource(this, 'postgresqlDataSource', {
      apiId: APIID,
      name: "postgresqlDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: queryDbFunction.functionArn
      },
      serviceRoleArn: appsyncLambdaServiceRole.roleArn
    });

    //Upload the right schema to appsync
    const apiSchema = new appsync.CfnGraphQLSchema(this, 'MyCfnGraphQLSchema', {
      apiId: APIID,

      definition: `
      type Edge {
        attributes: EdgeAttributes
        key: String
        source: String
        target: String
        undirected: Boolean
    }
    
    type EdgeAttributes {
        color: String
        sharedPublications: [String]
        size: Float
    }
    
    type Links {
        key: String!
        numPublications: Int!
        source: String!
        target: String!
    }
    
    type PotentialResearcher {
        firstName: String
        lastName: String
        id: String
        faculty: String
        sharedKeywords: [String]
    }
    
    type Publication {
        authors: String
        journal: String
        link: String
        title: String
        yearPublished: String
    }
    
    type Query {
        getAllFaculties: [String]
        getEdges(facultiesToFilterOn: [String], keyword: String): [Edge]
        getResearcher(id: String!): Researcher
        getResearcherData: ResearcherGraph
        getResearchers(facultiesToFilterOn: [String], keyword: String): [ResearcherNode]
        getSharedPublications(id1: String!, id2: String!): [Publication]
        getSimilarResearchers(researcher_id: String!): [PotentialResearcher]
    }
    
    type Researcher {
        department: String!
        email: String!
        faculty: String!
        firstName: String!
        id: String!
        keywords: String!
        lastName: String!
        rank: String!
    }
    
    type ResearcherAttributes {
        color: String!
        department: String!
        email: String!
        faculty: String!
        label: String
        rank: String!
    }
    
    type ResearcherGraph {
        links: [Links]
        nodes: [Researcher]
    }
    
    type ResearcherNode {
        attributes: ResearcherAttributes
        key: String
    }
      `
    });

    //Create All the resolvers for the schema
    const getAllFacultiesResolver = new appsync.CfnResolver(this, 'getAllFaculties', {
      apiId: APIID,
      fieldName: 'getAllFaculties',
      typeName: 'Query',
      dataSourceName: DataSource.name,
    });
    getAllFacultiesResolver.addDependsOn(opensearchDataSource);
    getAllFacultiesResolver.addDependsOn(apiSchema);

    const getSharedPublicationsResolver = new appsync.CfnResolver(this, 'getSharedPublications', {
      apiId: APIID,
      fieldName: 'getSharedPublications',
      typeName: 'Query',
      dataSourceName: opensearchDataSource.name,
    });
    getSharedPublicationsResolver.addDependsOn(opensearchDataSource);
    getSharedPublicationsResolver.addDependsOn(apiSchema);

    const fetchResearcherInformationResolver = new appsync.CfnResolver(this, 'fetchResearcherInformation', {
      apiId: APIID,
      fieldName: 'fetchResearcherInformation',
      typeName: 'Query',
      dataSourceName: opensearchDataSource.name,
    });
    fetchResearcherInformationResolver.addDependsOn(opensearchDataSource);
    fetchResearcherInformationResolver.addDependsOn(apiSchema);

    const fetchResearcherNodesResolver = new appsync.CfnResolver(this, 'fetchResearcherNodes', {
      apiId: APIID,
      fieldName: 'fetchResearcherNodes',
      typeName: 'Query',
      dataSourceName: opensearchDataSource.name,
    });
    fetchResearcherNodes.addDependsOn(opensearchDataSource);
    fetchResearcherNodes.addDependsOn(apiSchema);

    const fetchEdgesFromPostgresResolver = new appsync.CfnResolver(this, 'fetchEdgesFromPostgres', {
      apiId: APIID,
      fieldName: 'fetchEdgesFromPostgres',
      typeName: 'Query',
      dataSourceName: opensearchDataSource.name,
    });
    fetchEdgesFromPostgresResolver.addDependsOn(opensearchDataSource);
    fetchEdgesFromPostgresResolver.addDependsOn(apiSchema);

    const getSimilarResearchersResolver = new appsync.CfnResolver(this, 'getSimilarResearchers', {
      apiId: APIID,
      fieldName: 'getSimilarResearchers',
      typeName: 'Query',
      dataSourceName: opensearchDataSource.name,
    });
    getSimilarResearchersResolver.addDependsOn(opensearchDataSource);
    getSimilarResearchersResolver.addDependsOn(apiSchema);

    //Create all the PostgreSQL resolvers
    let postgresqlDBQueryList = ["allPublicationsPerFacultyQuery", "facultyMetrics", "getAllDepartments",
    "getAllDistinctJournals", "getAllFaculty", "getAllResearchersImpacts", "getNumberOfResearcherPubsAllYears",
    "getNumberOfResearcherPubsLastFiveYears", "getPub", "getResearcher", "getResearcherElsevier", "getResearcherFull",
    "getResearcherOrcid", "getResearcherPubsByCitations", "getResearcherPubsByTitle", "getResearcherPubsByYear",
    "getResearcherImpactsByDepartment", "getResearcherImpactsByFaculty", "totalPublicationPerYear", "wordCloud",
    "changeScopusId", "lastUpdatedResearchersList", "getUpdatePublicationsLogs", "getFlaggedIds", "getResearcherGrants", 
    "getAllGrantAgencies", "getResearcherPatents"];

    for(var i = 0; i<postgresqlDBQueryList.length; i++){
      const resolver = new appsync.CfnResolver(this, postgresqlDBQueryList[i], {
        apiId: APIID,
        fieldName: postgresqlDBQueryList[i],
        typeName: 'Query',
        dataSourceName: postgresqlDataSource.name,
      });
      resolver.addDependsOn(postgresqlDataSource);
      resolver.addDependsOn(apiSchema);
    }

    // Waf Firewall
    const waf = new wafv2.CfnWebACL(this, 'waf', {
      description: 'waf for Knowledge Graph',
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      visibilityConfig: { 
        sampledRequestsEnabled: true, 
        cloudWatchMetricsEnabled: true,
        metricName: 'knowledgeGraph-firewall'
      },
      rules: [
        {
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          priority: 1,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
            }
          },
          overrideAction: { none: {}},
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWS-AWSManagedRulesCommonRuleSet'
          }
        },
        {
          name: 'LimitRequests1000',
          priority: 2,
          action: {
            block: {}
          },
          statement: {
            rateBasedStatement: {
              limit: 1000,
              aggregateKeyType: "IP"
            }
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'LimitRequests1000'
          }
        },
    ]
    })

    const wafAssociation = new wafv2.CfnWebACLAssociation(this, 'waf-association', {
      resourceArn: `arn:aws:appsync:ca-central-1:${this.account}:apis/${APIID}`,
      webAclArn: waf.attrArn
    });
  }
}