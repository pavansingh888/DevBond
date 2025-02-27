const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  //this how we basically start listenting to connections
  io.on("connection", (socket) => {
    //handle events
    //whenever we recieve an event, we recieve the same data that is sent from client
    socket.on("joinChat", ({ userId, targetUserId }) => {
      //we need to create a room with a unique id
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log("Joining room : " + roomId);

      socket.join(roomId); //we do this so that one connection is established in a particular room.
    });

    socket.on("sendMessage", async ({ firstName, lastName, photoUrl, userId, targetUserId, text, createdAt }) => {
      try {
        //getting room id
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName + " sending message : " + text);

        // TODO: Check if userId & targetUserId are friends

        //finding existing chat of participants in DB
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        //Creating new instance of Chat model of participants - if alread not there in DB
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        //pushing new message into the created/existing chat of participants
        chat.messages.push({
          senderId: userId,
          text,
        });

        //saving chat in DB
        await chat.save();

        //the message that we have got at backend we have to send it to particular room, and emit the message from server to client, basically server is sending the message
        io.to(roomId).emit("messageRecieved", { senderId:userId, firstName, lastName, text, createdAt });

      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
