const express = require("express");
const { userAuth } = require("../middlewares/utils");

const requestRouter = express.Router();

requestRouter.post("/request", userAuth, (req, res) => {
  try {
    const userProfile = req.user;

    res.send(userProfile?.firstName + " has sent connection request");
  } catch (err) {
    res.status(401).send("ERROR" + err.message);
  }
});

module.exports = {
  requestRouter,
};
