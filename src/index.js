require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");
const { validators } = require("./utils/validators");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../src/middlewares/utils");

// To convert the JSON object to JS object we use the middleware
app.use(express.json());
// To parse the cookie and check in the console
app.use(cookieParser());

// Create a user and store the user details into the database
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    // Validate the req data
    validators(req);
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a JWT token
      const token = await jwt.sign({ _id: user._id }, "DevSwipe@2026");
      // Set a JWT token in the cookies
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      res.send("Invalid Credentials");
    }
  } catch (err) {
    throw new Error("Invalid Credentials");
  }
});

// To get the profile of a logged in user
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Something went wrong" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const userProfile = req.user;

    res.send(userProfile?.firstName + " has sent connection request");
  } catch (err) {
    res.status(401).send("ERROR" + err.message);
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
