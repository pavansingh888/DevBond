const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
       type:mongoose.Schema.Types.ObjectId,
       required:true,
    },
    toUserId:{
       type:mongoose.Schema.Types.ObjectId,
       required:true, 
    },
    status:{
       type: String,
       required:true,
       enum:{
        values:["ignored","interested","accepted","rejected"],
        message:`{VALUE} is incorrect status type`,
       },
    },

}, {timestamps:true});

// ConnectionRequest.find({fromUserId: 439856t2348956346, toUserId: 2349845623964387})
//
connectionRequestSchema.index({
    fromUserId:1,toUserId:1
});

// Purpose of Indexes:

// Speed up query performance by avoiding full collection scans.
// Enable efficient sorting and retrieval of data.
// Compound Index:

// Useful for queries with multiple fields (e.g., { fromUserId: 1, toUserId: 1 }).
// Advantages:

// Faster queries and sorting.
// Supports uniqueness constraints.
// Improves multi-collection joins (e.g., $lookup).
// Disadvantages:

// Increases storage usage.
// Slows down write operations due to index updates.
// Needs proper maintenance and optimization.
// When to Use:

// Index frequently queried fields.
// Create compound indexes for multi-field queries.
// Avoid unnecessary indexes on rarely queried fields.

connectionRequestSchema.pre("save",function(next){
  const connectionRequest = this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
