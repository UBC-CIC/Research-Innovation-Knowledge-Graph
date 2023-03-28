#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { AppsyncStack } from '../lib/appsync-stack';
import { DatabaseStack } from '../lib/database-stack';
import { GlueStack } from '../lib/glue-stack'

const app = new cdk.App();

const vpcStack = new VpcStack(app, "KnowledgeGraphVpcStack", 
    {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});
const databaseStack = new DatabaseStack(app, 'KnowledgeGraphDatabaseStack', vpcStack, 
    {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});
const appsyncStack = new AppsyncStack(app, 'KnowledgeGraphAppsyncStack', vpcStack, databaseStack,
    {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});
//const glueStack = new GlueStack(app, 'KnowledgeGraphGlueStack', vpcStack, databaseStack,
 //   {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});
