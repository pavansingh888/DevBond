const express= require("express");
const connectDB = require("./config/database");
const app=express();
const User=require("./models/users");
const validator=require("validator");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt');

app.use(express.json())

//create user - NEVER TRUST req.body
app.post("/signup", async (req,res) => {
    // const userObj = {
    //     firstName: "Virat",
    //     lastName: "Kohli",
    //     emailId: "virat@kohli.com",
    //     password: "Virat@1234",
    // }
  //creating a new instance of user model
    // const user = new User(userObj);
    console.log(req.body)

  
try {
    //validate req.body
  validateSignUpData(req);
  //Encrypt the password
  const { firstName, lastName, emailId, password } = req.body;
  const hashedPassword=await bcrypt.hash(password,10)
  console.log(hashedPassword);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:hashedPassword,
    })
    await user.save();
    res.send("User added successfully.")
      

   }catch(err){
    res.status(400).send("ERROR : " +err.message);
    }
});

//login user after comparing credentials
app.post("/login",async (req,res)=>{
    try {
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("Invalid user credentials!")
    }

    const storedPassword = user.password;
    const isPasswordValid=await bcrypt.compare(password,storedPassword);
    if(isPasswordValid){
        res.send("Login succesfull!!!")
    }else{
        throw new Error("Invalid user credentials!")
    }    

       } catch (err) {
        res.status(400).send("ERROR : "+err.message);
       }
})

//get a user with emailId
app.get("/user", async (req,res) => {
    console.log(req.body.emailId);
    
   try {
    const user = await User.find({emailId: req.body.emailId});
    res.send(user);
       }catch(err){
    res.status(400).send("Unable to fetch user: "+err.message);
    }
});

//get all user
app.get("/feed", async (req,res) => {
   try {
    const allUsers = await User.find({});
    res.send(allUsers);
       }catch(err){
    res.status(400).send("Unable to fetch feed: "+err.message);
    }
});

//delete a user by ID
app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
   try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!!!");
       }catch(err){
    res.status(400).send("Unable to delete user: "+err.message);
    }
});

//update a user - NEVER TRUST req.body
app.patch("/user/:userID",async (req,res)=>{
    const userId = req.params?.userID;
    const data= req.body
    try{
        //API level data sanitization to check updating only the fields allowed for the updates
       const allowedUpdates = ["photoUrl","about","gender","age","skills"];
       const isUpdateAllowed = Object.keys(data).every((k) => allowedUpdates.includes(k));
       if(!isUpdateAllowed){ throw new Error("Update not allowed");} 

       //API level data sanitization to check skills not more that 10
       if(data?.skills?.length>10){ throw new Error("Skills cannot be more than 10");}

       const user= await User.findByIdAndUpdate(userId, data, 
        { returnDocument:'after', runValidators:true, } //to run run DB level validate functions for patch/update request too. else DB level validators will only run for post/create request.
        );// It'll only update the the fields which are present in our Model schema. It will ignore userID sent from client.
       console.log(user);
       res.send("User updated successfully.")

    }catch(err){
        res.status(400).send("UPDATE FAILED: "+err.message);
    }
})




connectDB()
  .then(()=>{
    console.log("Connected to Database")
    app.listen(7777, () => console.log("Server is successfully listening on port 7777..."))
}).catch((err)=>{
    console.log("Error connecting to Database")
})