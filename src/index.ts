import * as iam from '@aws-cdk/aws-iam';
import { Construct, Duration, ConcreteDependable, CfnOutput } from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';

export interface MediaPackageOptions {

  /**
     * MediaPackage name.
     */
  readonly mediaPackageName: string;

  /*
    * MediaPackageEndpoint segmentDurationSeconds
    */
  readonly segmentDurationSeconds: number;

  /*
    * MediaPackageEndpoint playlistWindowSeconds
    */
  readonly playlistWindowSeconds: number;

  /*
    * MediaPackageEndpoint maxVideoBitsPerSecond
    */
  readonly maxVideoBitsPerSecond: number;

  /*
    * MediaPackageEndpoint minVideoBitsPerSecond
    */
  readonly minVideoBitsPerSecond: number;

  /*
    * MediaPackageEndpoint streamOrder
    */
  readonly streamOrder: string;

}

export class MediaPackageCustom extends Construct {
  constructor(scope: Construct, id: string, props: MediaPackageOptions) {
    super(scope, id);

    // Define policy. In this step policy might be overpermissive, but we don't know the ARN resource
    // So we will use ANY_RESOURCE trick
    const custom_policy = AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE });

    // Role execution for lambda assets
    const roleExecution = new iam.Role(scope=this, id='role-for-lambda-channel', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElementalMediaPackageFullAccess'),
      ],
    });

    // MediaPackage channel
    const channel = new AwsCustomResource(scope=this, id='media-channel-package'+props.mediaPackageName, {
      policy: custom_policy,
      logRetention: 0,
      resourceType: 'Custom::MediaPackageChannel',
      timeout: Duration.minutes(5),
      role: roleExecution,
      onCreate: {
        service: 'MediaPackage',
        action: 'createChannel',
        apiVersion: undefined,
        parameters: {
          Id: props.mediaPackageName,
          Description: 'Channel - ' + props.mediaPackageName,
        },
        physicalResourceId: PhysicalResourceId.of('media-live-stack'),
      },
      onUpdate: {
        service: 'MediaPackage',
        action: 'updateChannel',
        apiVersion: undefined,
        parameters: {
          Id: props.mediaPackageName,
          Description: 'Channel - ' + props.mediaPackageName,
        },
        physicalResourceId: PhysicalResourceId.of('media-live-stack'),
      },

      onDelete: {
        service: 'MediaPackage',
        action: 'deleteChannel',
        apiVersion: undefined,
        parameters: {
          Id: props.mediaPackageName,
        },
        physicalResourceId: PhysicalResourceId.of('media-live-stack'),
      },
    });

    // HLS ENDPOINT
    const hls_endpoint = new AwsCustomResource(scope=this, id='MediaPackageEndpoint-AWSCustomResource-'+props.mediaPackageName, {
      policy: custom_policy,
      logRetention: 0,
      resourceType: 'Custom::MediaPackageHlsEndpoint',
      timeout: Duration.minutes(5),
      role: roleExecution,
      onCreate: {
        service: 'MediaPackage',
        action: 'createOriginEndpoint',
        apiVersion: undefined,
        parameters: {
          ChannelId: props.mediaPackageName,
          Id: 'Endpoint-' + props.mediaPackageName,
          Description: 'Endpoint - ' + props.mediaPackageName,
          HlsPackage:
                {
                  SegmentDurationSeconds: props.segmentDurationSeconds,
                  PlaylistWindowSeconds: props.playlistWindowSeconds,
                  StreamSelection: {
                    MaxVideoBitsPerSecond: props.maxVideoBitsPerSecond,
                    MinVideoBitsPerSecond: props.minVideoBitsPerSecond,
                    StreamOrder: props.streamOrder,
                  },
                },
        },
        physicalResourceId: PhysicalResourceId.of('media-live-stack-endpoint'),
      },
      onUpdate: {
        service: 'MediaPackage',
        action: 'updateOriginEndpoint',
        apiVersion: undefined,
        parameters: {
          ChannelId: props.mediaPackageName,
          Id: 'Endpoint-' + props.mediaPackageName,
          Description: 'Endpoint - ' + props.mediaPackageName,
          HlsPackage:
                {
                  SegmentDurationSeconds: props.segmentDurationSeconds,
                  PlaylistWindowSeconds: props.playlistWindowSeconds,
                  StreamSelection: {
                    MaxVideoBitsPerSecond: props.maxVideoBitsPerSecond,
                    MinVideoBitsPerSecond: props.minVideoBitsPerSecond,
                    StreamOrder: props.streamOrder,
                  },
                },
        },
        physicalResourceId: PhysicalResourceId.of('media-live-stack-endpoint'),
      },

      onDelete: {
        service: 'MediaPackage',
        action: 'deleteOriginEndpoint',
        apiVersion: undefined,
        parameters: {
          Id: 'Endpoint-' + props.mediaPackageName,
        },
        physicalResourceId: PhysicalResourceId.of('media-live-stack-endpoint'),
      },
    });

    // Dependency
    const dependency = new ConcreteDependable();
    dependency.add(channel);
    hls_endpoint.node.addDependency(channel);

    new CfnOutput(scope=this, id='media-package-url-stream', {
      value: hls_endpoint.getResponseField('Url'),
    });
  }
}
