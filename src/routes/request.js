const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/authMiddle");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");
const mongoose = require("mongoose");

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
    connectionRequest.status= status;
    const data = await connectionRequest.save(); 

    res.json({message:"Connection request "+status,data});

  }catch(err){
    res.status(400).send("ERROR : "+err.message)
  }


});

  module.exports = requestRouter;