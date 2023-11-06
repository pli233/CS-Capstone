const {s3, bucketName} = require('../config/s3Config');


const uploadFileToS3 = async (key, body) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
  };

  try {
    const data = await s3.upload(params).promise();
    // console.log('File uploaded successfully. S3 URL:', data.Location);
    return data.Location;
  } catch (error) {
    // console.error('Error uploading file to S3:', error);
    throw error;
  }
};

const downloadFileFromS3 = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
  downloadFileFromS3
};