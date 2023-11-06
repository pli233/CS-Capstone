const AWS = require('aws-sdk');
const config = require('config');

AWS.config.update({
  accessKeyId: config.get('awsAccesskeyId'),
  secretAccessKey: config.get('awsAccesskeyPwd'),
});

const s3 = new AWS.S3();


const bucketName = config.get('bucketName');

module.exports = {
  s3,
  bucketName
};
