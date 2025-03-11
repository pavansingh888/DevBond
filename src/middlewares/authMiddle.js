const jwt = require("jsonwebtoken");
const User = require("../models/users")
const {USER_SAFE_DATA} = require('../utils/constants')
const cookie = require("cookie");

const userAuth = async (reqOrSocket, resOrNext, nextFn) => {
  try {
    let token;

    // **Check if middleware is being used in an Express route**
    if (reqOrSocket.headers && reqOrSocket.cookies) {
      token = reqOrSocket.cookies.token; // Extract token from cookies
    //   console.log("for http : ",token);
      
      if (!token) return resOrNext.status(401).send("Unauthorized: Please login");
      
    // **Check if middleware is being used in a WebSocket connection**
    } else if (reqOrSocket.handshake) {
        
      const cookies = cookie.parse(reqOrSocket.handshake.headers.cookie || ""); // Parse cookies from handshake
      token = cookies.token; // Extract token from parsed cookies
    //   console.log("for socket.io : ",token);
      if (!token) return resOrNext(new Error("Unauthorized: No token provided"));
    
    } else {
      return resOrNext.status
        ? resOrNext.status(401).send("Unauthorized")
        : resOrNext(new Error("Unauthorized"));
    }

    // **Verify the token**
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select(USER_SAFE_DATA);
    if (!user) {
      return resOrNext.status
        ? resOrNext.status(401).send("Unauthorized: User not found")
        : resOrNext(new Error("Unauthorized: User not found"));
    }

    // **Attach user object**
    if (reqOrSocket.headers) {
      reqOrSocket.user = user; // For Express
    //   console.log(reqOrSocket.user);
      nextFn();
    } else {
      reqOrSocket.user = user; // For Socket.io
    //   console.log(reqOrSocket.user);
      resOrNext();
    }
  } catch (err) {
    const errorMessage = "Unauthorized: " + err.message;
    return resOrNext.status
      ? resOrNext.status(401).send(errorMessage)
      : resOrNext(new Error(errorMessage));
  }
};


// const userAuth = async (req,res,next)=>{
//     try{
//         const {token} = req.cookies;
//         if(!token){
//            return res.status(401).send("Please login!"); //401 for Not authorized
//         }   
          
//         const decodedObj = jwt.verify(token,process.env.JWT_SECRET);
      
//         const {userId} = decodedObj;
//         const user = await User.findById(userId).select(USER_SAFE_DATA);
//         // console.log('view : ', user)
//         if(!user){
//             throw new Error("User not found");
//         }
//         req.user = user;
        
//         next();

//     }catch(err){
//         res.status(400).send("ERROR : "+err.message)
//     }
// }

module.exports= {
    userAuth,
}