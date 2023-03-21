#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { AppsyncStack } from '../lib/appsync-stack';
import { DatabaseStack } from '../lib/database-stack';
import { LambdaStack } from '../lib/lambda-stack'

const app = new cdk.App();

const vpcStack = new VpcStack(app, "VpcStack", 
    {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});
const databaseStack = new DatabaseStack(app, 'DatabaseStack', vpcStack, 
    {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});
const lambdaStack = new LambdaStack(app, 'DataFetchStack', databaseStack, 
    {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});
lambdaStack.addDependency(databaseStack)
const appsyncStack = new AppsyncStack(app, 'AppsyncStack', vpcStack, databaseStack,
    {env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }});