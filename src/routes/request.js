const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/users")

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
      }
     //checking if toUser is present in User DB
      const toUser = await User.findById(toUserId);
      console.log(toUserId)
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


  module.exports = requestRouter;