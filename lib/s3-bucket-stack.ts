import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface S3BucketStackProps extends cdk.StackProps {
  bucketName: string;
}

export class S3BucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: S3BucketStackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, "S3Bucket", {
      bucketName: props.bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
    });

    s3Bucket.grantPublicAccess("*", "S3:GetObject");

    s3Bucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
