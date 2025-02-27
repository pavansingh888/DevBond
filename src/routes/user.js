const express = require("express");
const { userAuth } = require("../middlewares/authMiddle");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        
        //fetching connection requests with status as interested and toUserID = loggedInUserID
        const connectionRequests = await  ConnectionRequest.find({
            status:"interested",
            toUserId: loggedInUser._id,
        }).populate("fromUserId",USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({message:"Data fetched successfully", data: connectionRequests });

    } catch (err) {
        res.status(400).send("ERROR : "+err.message);
    }
})

userRouter.get("/user/connections",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        
        //fetching connection requests which are in accepted status and contains the loggedInUserID -either in fromUserId or toUserId
        const connectionRequests = await  ConnectionRequest.find({
           $or:[
            {fromUserId:loggedInUser._id,status:"accepted"},{toUserId:loggedInUser._id,status:"accepted"}
           ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        

        //return data of the person other than the loggedInUser from data recieved in 'connectionRequests' above
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({ data });

    } catch (err) {
        res.status(400).send("ERROR : "+err.message);
    }
})

userRouter.delete("/user/connections/remove/:connectionId", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { connectionId } = req.params;
    //   console.log(connectionId);
      
      //connection request is accepted and involves the logged-in user and connectionId
      const connectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId:loggedInUser._id,
             toUserId:connectionId,
             status:"accepted"},
             {fromUserId:connectionId,
             toUserId:loggedInUser._id,
             status:"accepted"}
           ]
      })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
  
      //console.log(connectionRequest);
      
      if (!connectionRequest) {
        return res.status(400).json({ message: "Invalid requestId or not authorized!" });
      }
      
      //deleting the connection from DB
      await connectionRequest.deleteOne();
  
      res.json({ message: "Connection removed", data: connectionRequest });
    } catch (err) {
      res.status(500).send("ERROR: " + err.message);
    }
  });
  

userRouter.get("/feed", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const page= parseInt(req.query.page) || 1;
        let limit= parseInt(req.query.limit) || 10;
        limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString()),
            hideUserFromFeed.add(req.toUserId.toString())
        });
        
        const users = await User.find({
            $and: [
                {_id:{$nin : Array.from(hideUserFromFeed)}}, 
                {_id:{$ne:loggedInUser._id}}
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.json({data:users});
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

module.exports = userRouter;