var AWS = require('aws-sdk');

const PATH_TO_AWS_CONFIG = './aws-config.json'
const PHONE_NO = '+6581370736'
const AWS_REGION = 'ap-southeast-1'
const MSG = 'Test message by Jon via NodeJS'

AWS.config.loadFromPath(PATH_TO_AWS_CONFIG)
AWS.config.update({region: AWS_REGION})

var sns = new AWS.SNS();

var params = {
  Message: MSG,
  MessageStructure: 'string',
  PhoneNumber: PHONE_NO
};

sns.publish(params, function(err, data) {
  if (err) {
    console.log("FAIL", err, err.stack) // an error occurred
    return
  }
  console.log("OK", data);           // successful response
});
