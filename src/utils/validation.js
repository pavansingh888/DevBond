
const validator = require("validator");

const validateSignUpData = (req)=>{
  console.log(req.body);
  
  
  const {firstName, lastName, emailId, password}=req.body;

  if(!firstName && !lastName && !emailId && !password ){
    throw new Error("Please enter details to proceed!");
  }else if(!firstName || !lastName){
    throw new Error("Name is not valid");
  }else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid!")
  }else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password!")
  }

};

const validateEditProfileData = (req)=>{
  const allowedEditFields = ["firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",];

    const isEditAllowed = Object.keys(req.body).every((key)=> allowedEditFields.includes(key));
   
    return isEditAllowed;
}

module.exports={
    validateEditProfileData,
    validateSignUpData
}