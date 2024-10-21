const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest")

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

module.exports = userRouter;