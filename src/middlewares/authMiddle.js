const jwt = require("jsonwebtoken");
const User = require("../models/users")

const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
           return res.status(401).send("Please login!"); //401 for Not authorized
        }
          
        const decodedObj = jwt.verify(token,"DevTinder#200");
      
        const {userId} = decodedObj;
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        
        next();

    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
}

module.exports= {
    userAuth,
}