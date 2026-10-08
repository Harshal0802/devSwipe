require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");

// To convert the JSON object to JS object we use the middleware
app.use(express.json());

// Create a user and store the user details into the database
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("Error while saving the user" + err.message);
  }
});

// Get user by email
app.post("/user", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.find({ email: req.body.emailId });
    res.send(user);
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

//To get the all users
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(404).send("Something went wrong");
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
