const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(404).json({ message: "ERROR " + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: user._id, status: "accepted" },
        { fromUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((key) => {
      if (key.fromUserId._id.toString() === user._id.toString()) {
        return key.toUserId;
      }
      return key.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(401).json({ message: "ERROR " + error.message });
  }
});

module.exports = { userRouter };
