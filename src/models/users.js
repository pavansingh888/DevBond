const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },

})

// const User = mongoose.model("User", userSchema); //name starts with capital for Model to be conventionally correct , with this model we will create new new instances of user to add in DB.i.e creating a new user.

// module.exports = mongoose.model("Person", userSchema); //will create 'people' collection in MongoDB, when any document of this model type instance is saved into DB. It'll save it inside this 'people' collection
module.exports = mongoose.model("User", userSchema); //will create 'users' collection in MongoDB, when any document of this model type instance is saved into DB. It'll save it inside this 'users' collection