const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-1"; //region should be india region
// Create SES service object.
const sesClient = new SESClient({ 
    region: REGION,
    //Add credential to create SESCLIENT by yourself, its not given in docs, below syntax is for v3
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },

    //for v2 - directly pass these values
    // accessKeyId: process.env.AWS_ACCESS_KEY,
    // secretAccessKey: process.env.AWS_SECRET_KEY,
});
module.exports = { sesClient };