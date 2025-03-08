const jwt = require("jsonwebtoken");
const User = require("../models/users")
const {USER_SAFE_DATA} = require('../utils/constants')

const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
           return res.status(401).send("Please login!"); //401 for Not authorized
        }   
          
        const decodedObj = jwt.verify(token,process.env.JWT_SECRET);
      
        const {userId} = decodedObj;
        const user = await User.findById(userId).select(USER_SAFE_DATA);
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