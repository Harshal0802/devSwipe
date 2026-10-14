require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");
const { validators } = require("./utils/validators");
const bcrypt = require("bcrypt");

// To convert the JSON object to JS object we use the middleware
app.use(express.json());

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

// To delete the user by userId
app.delete("/deleteUser", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    console.log("User Deleted Successfully");
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(401).send("Something went wrong");
  }
});

// To update the user details by userId
app.patch("/updateUser/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;
    const ALLOWED_UPDATED = ["photoUrl", "age", "gender", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATED.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(401).send("Something went wrong");
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
