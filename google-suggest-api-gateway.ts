#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import * as apigw_integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "*";
const ORIGIN_URL = "https://www.google.com/complete/search";

const app = new cdk.App();
const stack = new cdk.Stack(app, "GoogleSuggestApiGatewayStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// API Gateway
const apiGateway = new apigw.HttpApi(stack, "HttpApi", {
  apiName: "Google suggest api proxy",
  corsPreflight: {
    allowMethods: [apigw.CorsHttpMethod.GET, apigw.CorsHttpMethod.OPTIONS],
    allowOrigins: [FRONTEND_URL],
  },
});

// API Gateway integration
const integration = new apigw_integrations.HttpUrlIntegration(
  "HttpUrl",
  ORIGIN_URL,
  { method: apigw.HttpMethod.GET }
);

apiGateway.addRoutes({
  path: "/api/suggest",
  methods: [apigw.HttpMethod.GET],
  integration,
});

new cdk.CfnOutput(stack, "ApiEndpoint", {
  value: apiGateway.apiEndpoint,
});
