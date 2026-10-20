const express = require("express");
const { userAuth } = require("../middlewares/utils");
const { validateEditProfileData } = require("../utils/validators");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Token is not valid");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    // Store the user from the userAuth
    const loggedInUser = req.user;
    Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]));

    loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}'s profile is updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
});

module.exports = {
  profileRouter,
};
