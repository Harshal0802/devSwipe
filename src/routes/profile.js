const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateForgetPasswordData,
} = require("../utils/validators");
const { User } = require("../models/user");

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

profileRouter.post("/profile/change-password", userAuth, async (req, res) => {
  const { emailId, newPassword } = req.body;

  try {
    validateForgetPasswordData(req);

    const user = req.user;

    if (user.emailId != emailId) {
      return res.status(404).json({ message: "User is different" });
    }

    const forgetPasswordUser = await User.findOne({
      emailId: emailId,
    });

    if (!forgetPasswordUser) {
      throw new Error("User not found");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    forgetPasswordUser.password = hashPassword;

    await forgetPasswordUser.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = {
  profileRouter,
};
