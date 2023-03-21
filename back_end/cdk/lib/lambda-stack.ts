import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { triggers } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_iam as iam} from 'aws-cdk-lib';
import  { aws_s3 as s3 } from 'aws-cdk-lib'
import { aws_stepfunctions as sfn} from 'aws-cdk-lib';
import { aws_stepfunctions_tasks as tasks} from 'aws-cdk-lib';
import { aws_logs as logs } from 'aws-cdk-lib';
import { ArnPrincipal, Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DatabaseStack } from './database-stack';

export class LambdaStack extends cdk.Stack {
  public readonly psycopg2: lambda.LayerVersion;
  public readonly postgres: lambda.LayerVersion;

  constructor(scope: cdk.App, id: string, databaseStack: DatabaseStack, props?: cdk.StackProps) {
    super(scope, id, props);

    /*
      Define Lambda Layers
    */
    // The layer containing the psycopg2 library
    this.psycopg2 = new lambda.LayerVersion(this, 'psycopg2', {
        code: lambda.Code.fromAsset('layers/psycopg2.zip'),
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
        Create the lambda roles
    */
    const databaseAccessRole = new Role(this, 'databaseAccessRole', {
      roleName: 'databaseAccessRole',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    databaseAccessRole.addToPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          // Secrets Manager
          "secretsmanager:GetSecretValue",
        ],
        resources: [`arn:aws:secretsmanager:ca-central-1:${this.account}:secret:knowledgeGraph/credentials/*`]
    }));

    /*
      Define Lambdas and add correct permissions
    */
    const getAllFaculties = new lambda.Function(this, 'knowledgeGraph-getAllFaculties', {
      functionName: 'knowledgeGraph-getAllFaculties',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'getAllFaculties.lambda_handler',
      layers: [this.psycopg2],
      code: lambda.Code.fromAsset('lambda/getAllFaculties'),
      timeout: cdk.Duration.minutes(15),
      role: databaseAccessRole,
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
        layers: [this.psycopg2],
        code: lambda.Code.fromAsset('lambda/getSharedPublications'),
        timeout: cdk.Duration.minutes(15),
        role: databaseAccessRole,
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
        layers: [this.psycopg2],
        code: lambda.Code.fromAsset('lambda/fetchResearcherInformation'),
        timeout: cdk.Duration.minutes(15),
        role: databaseAccessRole,
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
        layers: [this.psycopg2],
        code: lambda.Code.fromAsset('lambda/fetchResearcherNodes'),
        timeout: cdk.Duration.minutes(15),
        role: databaseAccessRole,
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
        layers: [this.psycopg2],
        code: lambda.Code.fromAsset('lambda/fetchEdgesFromPostgres'),
        timeout: cdk.Duration.minutes(15),
        role: databaseAccessRole,
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
        layers: [this.psycopg2],
        code: lambda.Code.fromAsset('lambda/getSimilarResearchers'),
        timeout: cdk.Duration.minutes(15),
        role: databaseAccessRole,
        logRetention: logs.RetentionDays.SIX_MONTHS,
        memorySize: 512,
        vpc: databaseStack.dbInstance.vpc, // add to the same vpc as rds
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      });
  }
}