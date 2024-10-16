const mongoose=require("mongoose");

const connectDB = async () => {
  mongoose.connect("mongodb+srv://LearnNode:nWuJTG76pW7cElQQ@learnnode.zn96c.mongodb.net/devBond");
};

module.exports= connectDB;