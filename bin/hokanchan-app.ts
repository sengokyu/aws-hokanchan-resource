#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ApiGatewayStack } from "../lib/api-gateway-stack";
import { CloudfrontStack } from "../lib/cloudfront-stack";
import { S3BucketStack } from "../lib/s3-bucket-stack";

const FRONTEND_HOST = process.env.FRONTEND_HOST!;
const CERTIFICATE_ARN = process.env.CERTIFICATE_ARN!;
const BUCKET_NAME = FRONTEND_HOST;

const region = "us-west-1";
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region,
};

const prefix = "Hokanchan";
const app = new cdk.App();

// Google suggest api proxy
const apiGatewayStack = new ApiGatewayStack(app, "ApiGateway", {
  stackName: `${prefix}ApiGateway`,
  env,
});

// S3 bucket
const s3bucketStack = new S3BucketStack(app, "S3Bucket", {
  stackName: `${prefix}S3Bucket`,
  bucketName: BUCKET_NAME,
});

// Cloudfront
const cloudfrontStack = new CloudfrontStack(app, "CloudFront", {
  stackName: `${prefix}Cloudfront`,
  env,
  frontendHost: FRONTEND_HOST,
  bucketName: BUCKET_NAME,
  restApi: apiGatewayStack.restApi,
  certificateArn: CERTIFICATE_ARN,
});

// Tagging
[apiGatewayStack, s3bucketStack, cloudfrontStack].forEach(
  (stack: cdk.Stack) => {
    stack.tags.setTag("application", prefix);
  }
);
