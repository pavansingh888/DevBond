const express = require("express");
const {validateSignUpData} = require("../utils/validation")
const User=require("../models/users");
const bcrypt = require("bcrypt");
const authRouter = express.Router(); //usually named as 'router' instead of 'authRouter' in the industry   



//create user - NEVER TRUST req.body
authRouter.post("/signup", async (req,res) => {
    // const userObj = {
    //     firstName: "Virat",
    //     lastName: "Kohli",
    //     emailId: "virat@kohli.com",
    //     password: "Virat@1234",
    // }
  //creating a new instance of user model
    // const user = new User(userObj);
    // console.log(req.body)

  
try {
    //validate req.body
  validateSignUpData(req);
  //Encrypt the password
  const { firstName, lastName, emailId, password } = req.body;
  const hashedPassword=await bcrypt.hash(password,10)
//   console.log(hashedPassword);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:hashedPassword,
    })
    const addedUser = await user.save();
    if(addedUser){
         //generating JWT auth token
         const token = await addedUser.getJWT(); //Using schema method
         //send cookie in response
         res.cookie("token",token,{ expires: 5400000, httpOnly: true })
    }
    res.send({message:"User added successfully.", data:addedUser})
      

   }catch(err){
    res.status(400).send("ERROR : " +err.message);
    }
});

//login user after comparing credentials
authRouter.post("/login",async (req,res)=>{
    try {
            //validating email
            const {emailId, password} = req.body;
            const user = await User.findOne({emailId:emailId});
            if(!user){
                    throw new Error("Invalid user credentials!")
                }
            //validating password
            const isPasswordValid=await user.validatePassword(password); //Using schema method
        
            if(isPasswordValid){
                //generating JWT auth token
                const token = await user.getJWT(); //Using schema method
                //send cookie in response
                res.cookie("token",token,{ maxAge: 5400000, httpOnly: true })
                res.send(user)
            }else{
                throw new Error("Invalid user credentials!")
            }    

       } catch (err) {
            res.status(400).send("ERROR : "+err.message);
       }
});

//logout and send cookie with null token
authRouter.post("/logout",async (req,res)=>{
    //do some DB operation/logs operation if required then logout.
    res.clearCookie("token", { 
        httpOnly: true, 
        secure: true, 
        sameSite: "Strict"
    }).send("Logout successful!");
})

module.exports = authRouter;