import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as cf_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface CloudfrontStackProps extends cdk.StackProps {
  frontendHost: string;
  bucketName: string;
  restApi: apigw.RestApi;
  certificateArn: string;
}

export class CloudfrontStack extends cdk.Stack {
  public readonly s3Bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: CloudfrontStackProps) {
    super(scope, id, props);

    // S3 bucket
    const bucket = s3.Bucket.fromBucketName(this, "Bucket", props.bucketName);

    // S3 origin
    // website indexを使いたいので、OAC / OAI はなし
    const defaultOrigin = new cf_origins.HttpOrigin(
      bucket.bucketWebsiteDomainName,
      { protocolPolicy: cf.OriginProtocolPolicy.HTTP_ONLY }
    );

    // API Gateway origin
    const apiOrigin = new cf_origins.RestApiOrigin(props.restApi);

    // Cloudfront distribution
    const distribution = new cf.Distribution(this, "Distribution", {
      domainNames: [props.frontendHost],
      priceClass: cf.PriceClass.PRICE_CLASS_200,
      defaultBehavior: {
        origin: defaultOrigin,
        allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cf.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: cf.OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
      },
      certificate: acm.Certificate.fromCertificateArn(
        this,
        "Certificate",
        props.certificateArn
      ),
    });

    distribution.addBehavior("/api*", apiOrigin, {
      allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachePolicy: cf.CachePolicy.CACHING_DISABLED,
      viewerProtocolPolicy: cf.ViewerProtocolPolicy.HTTPS_ONLY,
      originRequestPolicy: cf.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
    });

    //
    new cdk.CfnOutput(this, "distributionDomainName", {
      value: distribution.distributionDomainName,
    });
  }
}
