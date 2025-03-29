const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/authMiddle");
const ConnectionRequest = require("../models/connectionRequest");
const { USER_SAFE_DATA } = require("../utils/constants");
const User = require("../models/users");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail")

//send Interested or Ignored request.
requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try{
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
    
      //checking if request status is interested or ignored
      const allowedStatus = ["interested","ignored"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message: "Invalid status type: "+status});
      //Using **return res.status(...).json(...)** ensures that:
      // Execution stops after sending a response.
      // Prevents duplicate responses or further unintended code execution.
      // Keeps control flow clean and avoids errors like headers already sent.
      }
      
     //checking if toUser is present in User DB
      const toUser = await User.findById(toUserId);
      // console.log(toUserId)
      if(!toUser){
        return res.status(400).json({message: "User not found!"});
      }
     //checking if connection request already exists b/w fromUser and toUser
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or :[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId},],
      });
      
      if(existingConnectionRequest){
        return res.status(400).json({message: "Connection Request already exists!!"});
      }

      //Creating a ConnectionRequest Model object
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      //saving ConnectionRequest Model object, in ConnectionRequest collection
      const data = await connectionRequest.save();

      //after saving the connection request we will send email of the status was 'interested'
      try{
      if(status==='interested'){
        const requestCreator = req.user.firstName +" "+  req.user.lastName;
        const mailSubject = "You have new connection request on DevBond!";
        const mailBody = `
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
                    <p>Hi ${toUser.firstName},</p>
                    <p>You have received a new connection request from <strong>${requestCreator}</strong>.</p>
                    <p>Click the button below to view and accept or reject the request:</p>
                    <a href=${"https://devbond.in/requests"} class="btn">View Connection Request</a>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <p>Best regards,</p>
                    <p>The DevBond Team</p>
                  </div>
                  <div class="footer">
                    &copy; ${new Date().getFullYear()} DevBond. All rights reserved.
                  </div>
                </div>
              </body>
              </html>
            `;
        const mailSender = `notification@devbond.in`;    
        const mailReciever = toUser.emailId;
        const emailRes = await sendEmail.run(null,mailSender,mailSubject,mailBody);} //since run() is async and will give us promise
     }catch(errors){
       console.log("Error in email notification : ",errors.message)
     }


      const message = (function(){
        if(status==="interested"){ return (req.user.firstName + " is "+status+" in "+toUser.firstName)}else{
          return (req.user.firstName +" "+status+" "+toUser.firstName)
        }
      })();

      res.json({
        message,
        data,
      })

    }catch(err){
      res.status(400).send("ERROR : "+ err.message);
    }
  });

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req,res) => {
  try{
    const loggedInUser = req.user;
    const {requestId,status} = req.params;

    //checking if update status request is for accepting or rejecting the connection request
    if(!["accepted","rejected"].includes(status)){
      return res.status(400).json({messsage:"Status not allowed!"});
    }

    // checking if the requestId is valid mongoose ObjectId
    const isValidId = mongoose.Types.ObjectId.isValid(requestId);
    if (!isValidId) {
      return res.status(400).json({ message: "Invalid requestId format" });
    }

    //fetching connection request with given requestId(connectionRequestId), where toUserId is the loggedInUser and the status of connectionRequest is in "interested" state
    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested"
    })
    if(!connectionRequest){
      return res.status(400).json({message:"Connection request not found!"});
    }

    //updating connectionRequest status as "accepted" and updating in DB
    const data = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      { status: status },
      { new: true }
    ).populate("fromUserId", USER_SAFE_DATA);
    console.log(data.fromUserId);
    
    res.json({message:"Connection request "+status,data:data.fromUserId});

  }catch(err){
    res.status(400).send("ERROR : "+err.message)
  }


});

  module.exports = requestRouter;