const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config = new AWS.Config();

const bucketName = process.env.S3_BUCKET_NAME;
const bucketPrefix = process.env.S3_BUCKET_PREFIX;
const filePath = process.env.FILE_LOCATION;

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY;
AWS.config.secretAccessKey = process.env.AWS_ACCESS_SECRET;
AWS.config.region = process.env.AWS_REGION;

var s3 = new AWS.S3();

// downloadFile(filePath, bucketName, key);
const downloadFile = (filePath, bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  s3.getObject(params, (err, data) => {
    if (err) console.error(err);
    fs.writeFileSync(filePath, data.Body.toString());
    console.log(`${filePath} has been downloaded!`);
  });
};

// Download a folder
var params = {
  Bucket: bucketName, 
  Prefix: bucketPrefix
 };

var listObjectPromise = s3.listObjectsV2(params).promise();

listObjectPromise.then(function(data) {
  for (var i = 1; i < data.KeyCount; i++) {
  
  s3keyPath = data.Contents[i].Key
  fileName = s3keyPath.split(bucketPrefix+'/').pop()
  outputFilePath = filePath + fileName

  //console.log(fileName)

  console.log("Downloading "+s3keyPath);
  downloadFile(outputFilePath, bucketName, s3keyPath)
}

}).catch(function(err) {
  console.log(err);
});
