const express= require("express");

const app=express();

app.use("/test",(req,res,next)=>{  
    console.log("Hello from use test!");
    next();
});

app.use("/home",(req,res)=>{
    throw new Error("Error example working.")
    // res.send("Hello from home!");
});

app.get("/test", 
    (req,res,next)=>{ console.log("Hello from 1st get test!"); next()},
    (req,res,next)=>{ console.log("Hello from 2nd get test!"); next()},
    (req,res,next)=>{ res.send("Hello from 3rd get test!");}
)

app.use("/",(err,req,res,next)=>{
    if(err){
        console.log(err);
        res.send("Something went wrong!!!")
    }
})

app.listen(7777, () => console.log("Server is successfully listening on port 7777..."))