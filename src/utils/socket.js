const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId,targetUserId) => {
    return crypto.createHash("sha256").update([userId,targetUserId].sort().join("$")).digest("hex");
}


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
    socket.on("joinChat", ({userId, targetUserId}) => {
      //we need to create a room with a unique id
      const roomId = getSecretRoomId(userId,targetUserId) ;
      console.log("Joining room : "+roomId);
      
      socket.join(roomId); //we do this so that one connection is established in a particular room.
      

    })

    socket.on("sendMessage", ({firstName, userId, targetUserId, text}) => {
     
     const roomId = getSecretRoomId(userId,targetUserId);
      console.log(firstName+" sending message : "+text);
      //the message that we have got at backend we have to send it to particular room, and emit the message from server to client, basically server is sending the message
        io.to(roomId).emit("messageRecieved",{firstName,text})
    })

    socket.on("disconnect", () => {})
  });
};

module.exports = initializeSocket;