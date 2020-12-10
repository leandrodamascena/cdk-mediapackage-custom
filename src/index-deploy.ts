import * as cdk from '@aws-cdk/core';
import { MediaPackageCustom } from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

new MediaPackageCustom(stack, 'cdk-channel-package', {
  mediaPackageName: 'mychannel',
  segmentDurationSeconds: 5,
  playlistWindowSeconds: 60,
  maxVideoBitsPerSecond: 2147483647,
  minVideoBitsPerSecond: 0,
  streamOrder: 'ORIGINAL',
});