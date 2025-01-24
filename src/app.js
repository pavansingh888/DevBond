const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
require('dotenv').config();
require("./utils/cronjob");
const cookieParser = require("cookie-parser");


app.use(
  cors({
    origin: "http://localhost:5173", //this should tell you from where your frontend is hosted. We are kind of white listing this domain name.
    credentials: true, // So even if we are on http and not on https, we can still send the cookies and we can still recieve the data.
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDB()
  .then(() => {
    console.log("Connected to Database");
    app.listen(process.env.PORT, () =>
      console.log("Server is successfully listening on port 7777...")
    );
  })
  .catch((err) => {
    console.log("Error connecting to Database : ",err.message);
  });
