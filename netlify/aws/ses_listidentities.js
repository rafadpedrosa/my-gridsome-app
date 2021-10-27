// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create listIdentities params
var params = {
    IdentityType: "Domain",
    MaxItems: 10
};

// Create the promise and SES service object
var listIDsPromise = new AWS.SES({apiVersion: '2010-12-01'}).listIdentities(params).promise();

// Handle promise's fulfilled/rejected states
listIDsPromise.then(
    function(data) {
        console.log(data.Identities);
    }).catch(
    function(err) {
        console.error(err, err.stack);
    });