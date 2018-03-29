const aws = require('aws-sdk')
const express = require('express')

// AWS stuff
const PATH_TO_AWS_CONFIG = './aws-config.json'
const AWS_ACCESS_KEY_ID = process.env.SMS_USER
const AWS_SECRET_ACCESS_KEY = process.env.SMS_PASSWORD
const AWS_REGION = 'ap-southeast-1'

// express server stuff
const SERVER_PORT = 8080 // was 3000

// defaults
const DFLT_PHONE = '+6581370736'
const DFLT_MSG = 'Test message by Jon via NodeJS'

aws.config.loadFromPath(PATH_TO_AWS_CONFIG)
aws.config.update({region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

const sns = new aws.SNS();

const sendSmsP = (msg, phoneNo) => 
  new Promise((resolve, reject) => {
    const params = {
      Message: msg + ' -sent by Jon SMS svc',
      MessageStructure: 'string',
      PhoneNumber: phoneNo
    };
    
    sns.publish(params, function(err, data) {
      if (err) {        
        console.log("FAIL", err, err.stack) // an error occurred
        reject(err)
        return
      }
      console.log("OK", data);           
      resolve(data) // successful response
    });
  })

const handleSms = (req, res) => {
  if (!req.query.phone || !req.query.msg) {
    res.send("FAIL; expected querystring inputs: phone, msg; but got " + JSON.stringify(req.query))
    return
  } 

  sendSmsP(req.query.msg, req.query.phone)
    .then(resp => res.send("OK; " + JSON.stringify(resp)))
    .catch(err => res.send("FAIL; " + JSON.stringify(err)))
}

const handleTest = (req, res) => {
  sendSmsP(DFLT_MSG, DFLT_PHONE)
    .then(resp => res.send("OK; " + JSON.stringify(resp)))
    .catch(err => res.send("FAIL; " + JSON.stringify(err)))
}

const handleEcho = (req, res) => {
  const queryString = JSON.stringify(req.query)
  res.send('ECHO received req.query:\n' + queryString)
}

const app = express()

app.get('/', (req, res) => res.send("Welcome to Jon's SMS Service! Goto /send and give querystring phone and msg."))
app.get('/echo', handleEcho)
app.get('/send', handleSms)
app.get('/test', handleTest)

app.listen(SERVER_PORT, () => console.log('Example app listening on port', SERVER_PORT))
