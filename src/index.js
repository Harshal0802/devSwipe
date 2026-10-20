require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require("../src/routes/auth");
const { profileRouter } = require("../src/routes/profile");
const { requestRouter } = require("../src/routes/request");

// To convert the JSON object to JS object we use the middleware
app.use(express.json());
// To parse the cookie and check in the console
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777...");
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected", error);
  });
