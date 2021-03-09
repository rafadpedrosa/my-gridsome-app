// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create sendEmail params
var params = {
    Destination: { /* required */
        // CcAddresses: [
        //     'rafadpedrosacursos@gmail.com',
        //     /* more items */
        // ],
        ToAddresses: [
            'rafadpedrosa@gmail.com',
            'rafadpedrosagames@gmail.com',
            /* more items */
        ]
    },
    Message: { /* required */
        Body: { /* required */
            // Html: {
            //     Charset: "UTF-8",
            //     Data: "HTML_FORMAT_BODY"
            // },
            Text: {
                Charset: "UTF-8",
                Data: "AMOR?! ESSE EMAIL CHEGOU AI PRA TU? Se sim, me manda um zap! \b vou dar 20min. Se tu nao responder eu falo contigo pra ver se chegou de fato, rsrs. Te amo!"
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Test email - Do Seu Amor (Rafael Dias Pedrosa)'
        }
    },
    Source: 'rafadpedrosa@gmail.com', /* required */
    ReplyToAddresses: [
        'rafadpedrosa@gmail.com',
        /* more items */
    ],
};

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
    function (data) {
        console.log(data.MessageId);
    }).catch(
    function (err) {
        console.error(err, err.stack);
    });