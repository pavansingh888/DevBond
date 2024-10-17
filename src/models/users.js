const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
    firstName: {
        type: String,
        required:true,
        trim:true,
        minLength:4,
        maxLength:50,

    },
    lastName: {
        type: String,
        required:true,
        trim:true,
        minLength:4,
        maxLength:50,
    },
    emailId: {
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: ",value)
            }
        }
    },
    age: {
        type: Number,
        min:18,

    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value)) {
              throw new Error("Invalid Photo URL: " + value);
            }
          },
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    },
}, { timestamps:true })

// const User = mongoose.model("User", userSchema); //name starts with capital for Model to be conventionally correct , with this model we will create new new instances of user to add in DB.i.e creating a new user.

// module.exports = mongoose.model("Person", userSchema); //will create 'people' collection in MongoDB, when any document of this model type instance is saved into DB. It'll save it inside this 'people' collection
module.exports = mongoose.model("User", userSchema); //will create 'users' collection in MongoDB, when any document of this model type instance is saved into DB. It'll save it inside this 'users' collection