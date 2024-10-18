const express= require("express");
const connectDB = require("./config/database");
const app=express();
const User=require("./models/users");
const {validateSignUpData} = require("./utils/validation")
const cookieParser = require('cookie-parser')
const {userAuth} = require("./middlewares/auth")


app.use(express.json())
app.use(cookieParser())


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
                res.cookie("token",token,{ expires: new Date(Date.now() + 900000), httpOnly: true })
                res.send("Login succesfull!!!")
            }else{
                throw new Error("Invalid user credentials!")
            }    

       } catch (err) {
            res.status(400).send("ERROR : "+err.message);
       }
})


app.get("/profile",userAuth ,async (req,res) => {
    try{
        res.send(req.user.firstName)
    }catch (err) {
        res.status(400).send("ERROR : "+err.message);
       }
})

//send 
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    // Sending a connection request
    console.log("Sending a connection request");
  
    res.send(user.firstName + " sent the connect request!");
  });




connectDB()
  .then(()=>{
    console.log("Connected to Database")
    app.listen(7777, () => console.log("Server is successfully listening on port 7777..."))
}).catch((err)=>{
    console.log("Error connecting to Database")
})