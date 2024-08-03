import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class AltS3SelectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // q ライブラリを含む Lambda Layer を作成
    const qLayer = new lambda.LayerVersion(this, 'QLayer', {
      layerVersionName: 'alt_s3_select_q_layer',
      code: lambda.Code.fromAsset(path.join(__dirname, '../layers/q')),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
      description: 'q library layer',
    });

    // Lambda関数に与えるIAMロールを作成
    const role = new iam.Role(this, 'S3SelectFunctionRole', {
      roleName: 'alt_s3_select_role',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess')
    );

    // 本体の Lambda 関数を作成
    const lambdaFunction = new lambda.Function(this, 'S3SelectFunction', {
      functionName: 'alt_s3_select',
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      layers: [qLayer],
      role: role,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64,
    });
  }
}
