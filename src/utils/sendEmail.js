const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

//this will create and return a new SendEmailCommand object with the configured value.
const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items - you can add cc addresses here */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
          Text: {
            Charset: "UTF-8",
            Data: "EMAIL_BODY",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  
//Actual code to run the and send the email.
const run = async (toEmailId, fromEmailId, subject, body ) => {
    const sendEmailCommand = createSendEmailCommand(
        //make sure whatever email id's u are using should be verified in AWS SES otherwise email won't go thru sandbox
      "psinghp888@gmail.com", //pass the to address
      fromEmailId, //pass the from address
      subject,
      body,
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        // /** @type { import('@aws-sdk/client-ses').MessageRejected} */ - extra code not needed for now
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  module.exports = { run };

