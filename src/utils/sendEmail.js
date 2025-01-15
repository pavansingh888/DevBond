const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

//this will create and return a new SendEmailCommand object with the configured value.
const createSendEmailCommand = (toAddress, fromAddress) => {
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
            Data: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Connection Request</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                    color: #333;
                  }
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                  }
                  .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                  }
                  .content {
                    padding: 20px;
                    text-align: left;
                    line-height: 1.6;
                  }
                  .content p {
                    margin: 10px 0;
                  }
                  .content .btn {
                    display: inline-block;
                    margin-top: 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                  }
                  .content .btn:hover {
                    background-color: #0056b3;
                  }
                  .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777;
                    background-color: #f4f4f9;
                    border-top: 1px solid #ddd;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    Connection Request Notification
                  </div>
                  <div class="content">
                    <p>Hi {{username}},</p>
                    <p>You have received a new connection request from <strong>{{requester_name}}</strong>.</p>
                    <p>Click the button below to view and accept or reject the request:</p>
                    <a href="{{connection_url}}" class="btn">View Connection Request</a>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <p>Best regards,</p>
                    <p>The [Your App Name] Team</p>
                  </div>
                  <div class="footer">
                    &copy; 2025 [Your App Name]. All rights reserved.
                  </div>
                </div>
              </body>
              </html>
            `,
          },
          Text: {
            Charset: "UTF-8",
            Data: `
      Hi {{username}},
      
      You have received a new connection request from {{requester_name}}.
      
      Click the link below to view and accept or reject the request:
      {{connection_url}}
      
      If you have any questions, feel free to contact our support team.
      
      Best regards,
      The [Your App Name] Team
      `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "You Have a New Connection Request",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  
//Actual code to run the and send the email.
const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        //make sure whatever email id's u are using should be verified in AWS SES otherwise email won't go thru sandbox
      "psinghp888@gmail.com", //pass the to address
      "pavan@devbond.in", //pass the from address
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

