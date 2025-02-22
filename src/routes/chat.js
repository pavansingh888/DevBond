const express = require("express");
const { userAuth } = require("../middlewares/authMiddle");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  // console.log(req.user)
  if(req.user.isPremium){

    try{

      let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      }).populate({
        path: "messages.senderId",
        select: "firstName lastName photoUrl",
      });
  
      if (!chat) {
        chat = new Chat({
          participants: [userId, targetUserId],
          messages: [],
        });
        await chat.save();
      }
      res.json(chat);
  
    } catch (err) {
      console.error(err);
    }
   
  }else{
    return res.status(403).json({
      isPremium: false,
      message: "Access denied. Chat feature is only available for premium users.",
    });
  }
  
 
});

module.exports = chatRouter;