const express = require("express");
const {userAuth} = require("../middlewares/authMiddle")
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay")
const Payment = require("../models/payment")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

paymentRouter.post("/payment/create", userAuth, async (req,res)=>{
   try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount:49900,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

      //save it in my database
      console.log(order);
      
      const payment = new Payment({
        userId: req.user._id,
        orderId: order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes,
      });
  
      const savedPayment = await payment.save();
  
      // Return back my order details to frontend
      res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });

   } catch (error) {
    return res.status(500).json({msg:error.message});
    
   }

})

//RZP will make a call to this API, so we don't need to userAuth here
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");  
    //whenever RZP will call Webhook, It will send the req.body which needs to be passed below, it also send us a header "X-Razorpay-Signature" with this name.
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    //RZP have given this function validateWebhookSignature and it'll validate whether webhook is correct or not, coz suppose someone got to know that our webhook is at "/payment/webhook" and they will try to send some malicious info to our webhook signature, if we do this  validateWebhookSignature will fail, it return some boolean 

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("Invalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;  //we will get payment details from here

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await user.save();

    // Update the user as premium

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay , always send res(200), otherwise RZP will keep calling your webhook in loop again and again. 

    return res.status(200).json({ msg: "Webhook received successfully" }); 
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});



module.exports=paymentRouter
