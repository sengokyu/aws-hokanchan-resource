import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiGatewayStackProps extends cdk.StackProps {}

export class ApiGatewayStack extends cdk.Stack {
  public readonly restApi: apigw.RestApi;

  constructor(scope: Construct, id: string, props?: ApiGatewayStackProps) {
    super(scope, id, props);

    const integration = new apigw.HttpIntegration(
      "https://www.google.com/complete/search",
      {
        httpMethod: "GET",
        options: {
          requestParameters: {
            "integration.request.querystring.q": "method.request.querystring.q",
            "integration.request.querystring.hl":
              "method.request.querystring.hl",
            // いくつかのクエリストリングは固定値にする
            "integration.request.querystring.output": "'toolbar'",
            // 渡すHTTPヘッダ
            "integration.request.header.Accept": "'*/*'",
            "integration.request.header.User-Agent": "'hokanchan/1.0'",
          },
        },
      }
    );

    const restApi = new apigw.RestApi(this, "RestApi", {
      restApiName: "Google complete search",
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });

    restApi.root
      .addResource("api")
      .addResource("suggest")
      .addMethod("GET", integration, {
        requestParameters: {
          // 受け付けるクエリストリング
          "method.request.querystring.q": true,
          "method.request.querystring.hl": true,
        },
      });

    //
    this.restApi = restApi;
  }
}
