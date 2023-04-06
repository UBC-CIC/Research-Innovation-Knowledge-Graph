import * as cdk from "aws-cdk-lib";
import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcStack } from "./vpc-stack";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as iam from "aws-cdk-lib/aws-iam";
import * as glue from "aws-cdk-lib/aws-glue";
import * as sm from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { triggers } from "aws-cdk-lib";
import { DatabaseStack } from "./database-stack";
import { Effect, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export class GlueStack extends Stack {

  public readonly glueConnection: glue.CfnConnection;
  public readonly glueConnectionName: string;
  public readonly glueDmsConnection: glue.CfnConnection;
  public readonly glueDmsConnectionName: string;
  public readonly secretPath: string;
  public readonly glueS3Bucket: s3.Bucket;
  public readonly dmsTaskArn: string;

  constructor(
    scope: Construct,
    id: string,
    vpcStack: VpcStack,
    databaseStack: DatabaseStack,
    props?: StackProps
  ) {
    super(scope, id, props);
    this.secretPath = databaseStack.secretPath;

    // Create new Glue Role. DO NOT RENAME THE ROLE!!!
    const roleName = "AWSGlueServiceRole-ShellJob";
    const glueRole = new iam.Role(this, roleName, {
      assumedBy: new iam.ServicePrincipal("glue.amazonaws.com"),
      description: "Glue Service Role for Grant ETL",
      roleName: roleName,
    });

    // Add different policies to glue-service-role
    const glueServiceRolePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "service-role/AWSGlueServiceRole"
    );
    const glueConsoleFullAccessPolicy =
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSGlueConsoleFullAccess");
    const glueSecretManagerPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "SecretsManagerReadWrite"
    );
    const glueAmazonS3FullAccessPolicy =
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess");

    glueRole.addManagedPolicy(glueServiceRolePolicy);
    glueRole.addManagedPolicy(glueConsoleFullAccessPolicy);
    glueRole.addManagedPolicy(glueSecretManagerPolicy);
    glueRole.addManagedPolicy(glueAmazonS3FullAccessPolicy);

    // Create S3 bucket for Glue Job scripts/data
    this.glueS3Bucket = new s3.Bucket(this, "knowledgeGraph-glue-s3-bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      serverAccessLogsPrefix: "accessLog"
    });

    // Create a Connection to the PostgreSQL database inside the VPC
    this.glueConnectionName = "postgres-conn";
    const databaseSecret = sm.Secret.fromSecretNameV2(
      this,
      "databaseSecret",
      databaseStack.secretPath
    );
    const host = databaseSecret.secretValueFromJson("host").unsafeUnwrap();
    const dbname = databaseSecret.secretValueFromJson("dbname").unsafeUnwrap();
    const connectionProperties: { [key: string]: any } = {
      JDBC_ENFORCE_SSL: "true",
      JDBC_CONNECTION_URL: "jdbc:postgresql://" + host + ":5432/" + dbname,
      SKIP_CUSTOM_JDBC_CERT_VALIDATION: "true",
      SECRET_ID: databaseStack.secretPath,
      KAFKA_SSL_ENABLED: "false",
    };
    const publicSubnetId = vpcStack.vpc.publicSubnets[0].subnetId;
    const securityGroup = vpcStack.vpc.vpcDefaultSecurityGroup;
    this.glueConnection = new glue.CfnConnection(
      this,
      this.glueConnectionName,
      {
        catalogId: this.account, // this AWS account ID
        connectionInput: {
          name: this.glueConnectionName,
          description: "a connection to the PostgreSQL database for Glue",
          connectionType: "JDBC",
          connectionProperties: connectionProperties,
          physicalConnectionRequirements: {
            availabilityZone: vpcStack.availabilityZones[0],
            securityGroupIdList: [securityGroup],
            subnetId: publicSubnetId,
          },
        },
      }
    );

    // Glue Jobs: store data into table in database
    const storeDataJobName1 = "knowledgeGraph-storeData1";
    const storeDataJob1 = new glue.CfnJob(this, storeDataJobName1, {
      name: storeDataJobName1,
      role: glueRole.roleArn,
      command: {
        name: "pythonshell",
        pythonVersion: '3.9',
        scriptLocation:
          "s3://" +
          this.glueS3Bucket.bucketName +
          "/scripts/storeData" +
          ".py",
      },
      executionProperty: {
        maxConcurrentRuns: 1,
      },
      connections: {
        connections: [this.glueConnectionName],
      },
      maxRetries: 0,
      timeout: 2880, // 120 min timeout duration
      glueVersion: '3.0',
    });

    // Deploy glue job to glue S3 bucket
    new s3deploy.BucketDeployment(this, "DeployGlueJobFiles1", {
      sources: [s3deploy.Source.asset("./glue/scripts/")],
      destinationBucket: this.glueS3Bucket,
      destinationKeyPrefix: "scripts/",
    });

    const storeDataJobName2 = "knowledgeGraph-storeData2";
    const storeDataJob2 = new glue.CfnJob(this, storeDataJobName2, {
      name: storeDataJobName2,
      role: glueRole.roleArn,
      command: {
        name: "pythonshell",
        pythonVersion: '3.9',
        scriptLocation:
          "s3://" +
          this.glueS3Bucket.bucketName +
          "/scripts/storeData" +
          ".py",
      },
      executionProperty: {
        maxConcurrentRuns: 1,
      },
      connections: {
        connections: [this.glueConnectionName],
      },
      maxRetries: 0,
      timeout: 2880, // 120 min timeout duration
      glueVersion: '3.0',
    });

    // Deploy glue job to glue S3 bucket
    new s3deploy.BucketDeployment(this, "DeployGlueJobFiles2", {
      sources: [s3deploy.Source.asset("./glue/scripts/")],
      destinationBucket: this.glueS3Bucket,
      destinationKeyPrefix: "scripts/",
    });

    const storeDataJobName3 = "knowledgeGraph-storeData3";
    const storeDataJob3 = new glue.CfnJob(this, storeDataJobName3, {
      name: storeDataJobName3,
      role: glueRole.roleArn,
      command: {
        name: "pythonshell",
        pythonVersion: '3.9',
        scriptLocation:
          "s3://" +
          this.glueS3Bucket.bucketName +
          "/scripts/storeData" +
          ".py",
      },
      executionProperty: {
        maxConcurrentRuns: 1,
      },
      connections: {
        connections: [this.glueConnectionName],
      },
      maxRetries: 0,
      timeout: 2880, // 120 min timeout duration
      glueVersion: '3.0',
    });

    // Deploy glue job to glue S3 bucket
    new s3deploy.BucketDeployment(this, "DeployGlueJobFiles3", {
      sources: [s3deploy.Source.asset("./glue/scripts/")],
      destinationBucket: this.glueS3Bucket,
      destinationKeyPrefix: "scripts/",
    });

    // Grant S3 read/write role to Glue
    this.glueS3Bucket.grantReadWrite(glueRole);

    // Destroy Glue related resources when GrantDataStack is deleted
    storeDataJob1.applyRemovalPolicy(RemovalPolicy.DESTROY);
    storeDataJob2.applyRemovalPolicy(RemovalPolicy.DESTROY);
    storeDataJob3.applyRemovalPolicy(RemovalPolicy.DESTROY);
    this.glueConnection.applyRemovalPolicy(RemovalPolicy.DESTROY);
    glueRole.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}