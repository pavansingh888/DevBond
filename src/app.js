const express= require("express");
const connectDB = require("./config/database")
const app=express();
const User=require("./models/users")

app.use(express.json())

//create user
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
    const user = new User(req.body)
   try {
    await user.save();
    res.send("User added successfully.")
       }catch(err){
    res.status(400).send("User not created."+err.message);
    }
});

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

//update a user
app.patch("/user",async (req,res)=>{
    try{
       const user= await User.findByIdAndUpdate(req.body.userId, req.body, {returnDocument:'after'});// It'll only update the the fields which are present in our Model schema. It will ignore userID sent from client.
       console.log(user);
       res.send("User updated successfully.")
    }catch(err){
        res.status(400).send("Unable to update user: "+err.message);
    }
})




connectDB()
  .then(()=>{
    console.log("Connected to Database")
    app.listen(7777, () => console.log("Server is successfully listening on port 7777..."))
}).catch((err)=>{
    console.log("Error connecting to Database")
})