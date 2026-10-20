const express = require("express");
const { userAuth } = require("../middlewares/utils");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Token is not valid");
    }
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR" + err.message);
  }
});

module.exports = {
  profileRouter,
};
