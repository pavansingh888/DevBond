const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const sendEmail = require("./sendEmail")

cron.schedule("58 20 * * *",async () => {
    //send email to all people who got requests the previous day
    try {
        const yesterday = subDays(new Date(),0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequest = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
              },
        }).populate("fromUserId toUserId");

        const listOfToUsers = [ ...new Set(pendingRequest.map((req)=> req.toUserId))];

        // console.log(listOfToUsers);
        
        for (const toUser of listOfToUsers) {
            // Send Emails
            try {

                const mailSubject = "Reminder: Pending Connection Requests on DevBond";
                const mailBody = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reminder: Pending Connection Requests</title>
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
              Reminder: Pending Connection Requests
            </div>
            <div class="content">
              <p>Hi ${toUser.firstName},</p>
              <p>You have pending connection requests received yesterday that you haven't responded to yet.</p>
              <p>Click the button below to view and respond to these requests:</p>
              <a href=${"https://devbond.in/requests"} class="btn">View Pending Requests</a>
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Best regards,</p>
              <p>The DevBond Team</p>
            </div>
            <div class="footer">
              &copy; 2025 DevBond. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;
                const mailSender = `reminder@devbond.in`;

                const res = await sendEmail.run(null,mailSender,mailSubject,mailBody);
                // console.log(res);
            } catch (err) {
              console.log(err);
            }
          }

    } catch (error) {
        console.log(error);
    }
});