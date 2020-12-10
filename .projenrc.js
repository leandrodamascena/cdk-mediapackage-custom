const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  authorAddress: 'leandro.damascena@gmail.com',
  authorName: 'Leandro Damascena',
  cdkVersion: '1.73.0',
  name: 'cdk-mediapackage-custom',
  repository: 'https://github.com/leandrodamascena/cdk-mediapackage-custom.git',
  keywords: [
    'mediapackage',
    'mediaservices',
    'livestream',
  ],
  cdkDependencies: [
    '@aws-cdk/custom-resources',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-s3',
    '@aws-cdk/core',
  ],
  python: {
    distName: 'cdk-mediapackage-custom',
    module: 'cdk_mediapackage_custom',
  },
});

project.synth();