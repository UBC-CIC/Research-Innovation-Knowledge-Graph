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
import { aws_logs as logs } from 'aws-cdk-lib';

export class AppsyncStack extends Stack {
  constructor(scope: Construct, id: string, vpcStack: VpcStack, databaseStack: DatabaseStack,  props?: StackProps) {
    super(scope, id, props);

    // Get the API ID from paramter Store
    // During Amplify Deployment the APIID is stored in parameter store
    const APIID = ssm.StringParameter.fromStringParameterAttributes(this, 'KnowledgeGraphGraphQLAPIIdOutput', {
      parameterName: 'KnowledgeGraphGraphQLAPIIdOutput',
    }).stringValue;

    //Get default secuirty group
    const defaultSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, id, vpcStack.vpc.vpcDefaultSecurityGroup);

    /*
      Define Lambda Layers
    */
    // The layer containing the psycopg2 library
    const psycopg2 = new lambda.LayerVersion(this, 'psycopg2', {
      code: lambda.Code.fromAsset('layers/psycopg2/psycopg2.zip'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
      description: 'Contains the psycopg2 library',
    });

  /*
  // Create the database tables (runs during deployment)
  const createTables = new triggers.TriggerFunction(this, 'expertiseDashboard-createTables', {
    functionName: 'expertiseDashboard-createTables',
    runtime: lambda.Runtime.PYTHON_3_9,
    handler: 'createTables.lambda_handler',
    layers: [this.psycopg2],
    code: lambda.Code.fromAsset('lambda/createTables'),
    timeout: cdk.Duration.minutes(15),
    memorySize: 512,
    vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
  });
  createTables.role?.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName(
      'SecretsManagerReadWrite',
    ),
  );
  */

  /*
      Create the lambda role
  */
  const lambdaRole = new Role(this, 'lambdaRole', {
    roleName: 'lambdaRole',
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  });
  lambdaRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        // Secrets Manager
        "secretsmanager:GetSecretValue",
      ],
      resources: [`arn:aws:secretsmanager:ca-central-1:${this.account}:secret:knowledgeGraph/credentials/*`]
  }));
  lambdaRole.addToPolicy(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:AssignPrivateIpAddresses",
      "ec2:UnassignPrivateIpAddresses"
    ],
    resources: ['*'] // must be *
  }));
  lambdaRole.addToPolicy(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      //Logs
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ],
    resources: ["arn:aws:logs:*:*:*"]
  }));

  /*
    Define Lambdas and add correct permissions
  */
  const getAllFaculties = new lambda.Function(this, 'knowledgeGraph-getAllFaculties', {
    functionName: 'knowledgeGraph-getAllFaculties',
    runtime: lambda.Runtime.PYTHON_3_9,
    handler: 'getAllFaculties.lambda_handler',
    layers: [psycopg2],
    code: lambda.Code.fromAsset('lambda/getAllFaculties'),
    timeout: cdk.Duration.minutes(15),
    role: lambdaRole,
    logRetention: logs.RetentionDays.SIX_MONTHS,
    memorySize: 512,
    vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  });

  const getSharedPublications = new lambda.Function(this, 'knowledgeGraph-getSharedPublications', {
      functionName: 'knowledgeGraph-getSharedPublications',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'getSharedPublications.lambda_handler',
      layers: [psycopg2],
      code: lambda.Code.fromAsset('lambda/getSharedPublications'),
      timeout: cdk.Duration.minutes(15),
      role: lambdaRole,
      logRetention: logs.RetentionDays.SIX_MONTHS,
      memorySize: 512,
      vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    const fetchResearcherInformation = new lambda.Function(this, 'knowledgeGraph-fetchResearcherInformation', {
      functionName: 'knowledgeGraph-fetchResearcherInformation',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'fetchResearcherInformation.lambda_handler',
      layers: [psycopg2],
      code: lambda.Code.fromAsset('lambda/fetchResearcherInformation'),
      timeout: cdk.Duration.minutes(15),
      role: lambdaRole,
      logRetention: logs.RetentionDays.SIX_MONTHS,
      memorySize: 512,
      vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    const fetchResearcherNodes = new lambda.Function(this, 'knowledgeGraph-fetchResearcherNodes', {
      functionName: 'knowledgeGraph-fetchResearcherNodes',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'fetchResearcherNodes.lambda_handler',
      layers: [psycopg2],
      code: lambda.Code.fromAsset('lambda/fetchResearcherNodes'),
      timeout: cdk.Duration.minutes(15),
      role: lambdaRole,
      logRetention: logs.RetentionDays.SIX_MONTHS,
      memorySize: 512,
      vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    const fetchEdgesFromPostgres = new lambda.Function(this, 'knowledgeGraph-fetchEdgesFromPostgres', {
      functionName: 'knowledgeGraph-fetchEdgesFromPostgres',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'fetchEdgesFromPostgres.lambda_handler',
      layers: [psycopg2],
      code: lambda.Code.fromAsset('lambda/fetchEdgesFromPostgres'),
      timeout: cdk.Duration.minutes(15),
      role: lambdaRole,
      logRetention: logs.RetentionDays.SIX_MONTHS,
      memorySize: 512,
      vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    const getSimilarResearchers = new lambda.Function(this, 'knowledgeGraph-getSimilarResearchers', {
      functionName: 'knowledgeGraph-getSimilarResearchers',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'getSimilarResearchers.lambda_handler',
      layers: [psycopg2],
      code: lambda.Code.fromAsset('lambda/getSimilarResearchers'),
      timeout: cdk.Duration.minutes(15),
      role: lambdaRole,
      logRetention: logs.RetentionDays.SIX_MONTHS,
      memorySize: 512,
      vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

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
                        resources: [getAllFaculties.functionArn, getSharedPublications.functionArn, 
                          fetchResearcherInformation.functionArn, fetchResearcherNodes.functionArn, 
                          fetchEdgesFromPostgres.functionArn, getSimilarResearchers.functionArn]
                    })
                ]
            }),
        },
    });

    //Create Appsync Data Sources
    const getAllFacultiesDataSource = new appsync.CfnDataSource(this, 'getAllFacultiesDataSource', {
      apiId: APIID,
      name: "getAllFacultiesDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: getAllFaculties.functionArn
      },
      serviceRoleArn: appsyncLambdaServiceRole.roleArn
    });

    const getSharedPublicationsDataSource = new appsync.CfnDataSource(this, 'getSharedPublicationsDataSource', {
      apiId: APIID,
      name: "getSharedPublicationsDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: getSharedPublications.functionArn
      },
      serviceRoleArn: appsyncLambdaServiceRole.roleArn
    });

    const fetchResearcherInformationDataSource = new appsync.CfnDataSource(this, 'fetchResearcherInformationDataSource', {
      apiId: APIID,
      name: "fetchResearcherInformationDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: fetchResearcherInformation.functionArn
      },
      serviceRoleArn: appsyncLambdaServiceRole.roleArn
    });

    const fetchResearcherNodesDataSource = new appsync.CfnDataSource(this, 'fetchResearcherNodesDataSource', {
      apiId: APIID,
      name: "fetchResearcherNodesDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: fetchResearcherNodes.functionArn
      },
      serviceRoleArn: appsyncLambdaServiceRole.roleArn
    });

    const fetchEdgesFromPostgresDataSource = new appsync.CfnDataSource(this, 'fetchEdgesFromPostgresDataSource', {
      apiId: APIID,
      name: "fetchEdgesFromPostgresDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: fetchEdgesFromPostgres.functionArn
      },
      serviceRoleArn: appsyncLambdaServiceRole.roleArn
    });

    const getSimilarResearchersDataSource = new appsync.CfnDataSource(this, 'getSimilarResearchersDataSource', {
      apiId: APIID,
      name: "getSimilarResearchersDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: getSimilarResearchers.functionArn
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
      dataSourceName: getAllFacultiesDataSource.name,
    });
    getAllFacultiesResolver.addDependsOn(getAllFacultiesDataSource);
    getAllFacultiesResolver.addDependsOn(apiSchema);

    const getSharedPublicationsResolver = new appsync.CfnResolver(this, 'getSharedPublications', {
      apiId: APIID,
      fieldName: 'getSharedPublications',
      typeName: 'Query',
      dataSourceName: getSharedPublicationsDataSource.name,
    });
    getSharedPublicationsResolver.addDependsOn(getSharedPublicationsDataSource);
    getSharedPublicationsResolver.addDependsOn(apiSchema);

    const fetchResearcherInformationResolver = new appsync.CfnResolver(this, 'fetchResearcherInformation', {
      apiId: APIID,
      fieldName: 'getResearcherData',
      typeName: 'Query',
      dataSourceName: fetchResearcherInformationDataSource.name,
    });
    fetchResearcherInformationResolver.addDependsOn(fetchResearcherInformationDataSource);
    fetchResearcherInformationResolver.addDependsOn(apiSchema);

    const fetchResearcherNodesResolver = new appsync.CfnResolver(this, 'fetchResearcherNodes', {
      apiId: APIID,
      fieldName: 'getResearchers',
      typeName: 'Query',
      dataSourceName: fetchResearcherNodesDataSource.name,
    });
    fetchResearcherNodesResolver.addDependsOn(fetchResearcherNodesDataSource);
    fetchResearcherNodesResolver.addDependsOn(apiSchema);

    const fetchEdgesFromPostgresResolver = new appsync.CfnResolver(this, 'fetchEdgesFromPostgres', {
      apiId: APIID,
      fieldName: 'getEdges',
      typeName: 'Query',
      dataSourceName: fetchEdgesFromPostgresDataSource.name,
    });
    fetchEdgesFromPostgresResolver.addDependsOn(fetchEdgesFromPostgresDataSource);
    fetchEdgesFromPostgresResolver.addDependsOn(apiSchema);

    const getSimilarResearchersResolver = new appsync.CfnResolver(this, 'getSimilarResearchers', {
      apiId: APIID,
      fieldName: 'getSimilarResearchers',
      typeName: 'Query',
      dataSourceName: getSimilarResearchersDataSource.name,
    });
    getSimilarResearchersResolver.addDependsOn(getSimilarResearchersDataSource);
    getSimilarResearchersResolver.addDependsOn(apiSchema);

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