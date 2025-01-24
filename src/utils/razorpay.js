const Razorpay = require("razorpay");

var rzp = new Razorpay({
    //get key ID and key secret from rzp dashboard
    key_id: process.env.RAZORPAY_KEY_ID, //can be public
    key_secret: process.env.RAZORPAY_KEY_SECRET, //this is kind of like password
  });

  module.exports = rzp