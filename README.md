# AWS CDK application for Hokanchan

## Getting started

1. Create a certificate in us-east-1 region.
2. `cp .env.sample .env && vi .env`
3. `npm run deploy S3Bucket ApiGateway CloudFront`

## Configurations

| Name            | Description              |
| :-------------- | :----------------------- |
| FRONTEND_URL    |                          |
| CERTIFICATE_ARN | An ARN of a certificate. |
