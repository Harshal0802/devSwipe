require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Tom",
    lastName: "Holland",
    email: "tom@gmail.com",
    password: "Tom@123",
    age: 30,
    gender: "male",
  });

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("Error while saving the user" + err.message);
  }
});

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
