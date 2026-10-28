const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

// To send the connection request by ignored or interested
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // 1. Validate status
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: `Invalid status: ${status}` });
      }

      // 2. Validate user ID
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({
          message: "Invalid user id",
        });
      }

      // 3. Prevent sending a request to yourself
      if (fromUserId.equals(toUserId)) {
        return res.status(404).json({
          message: "Cannot send connection request to yourself!",
        });
      }

      // 4. Check whether recipient exists
      const toUserExist = await User.findById(toUserId);

      if (!toUserExist) {
        return res.status(404).json({
          message: "User not found!",
        });
      }

      // 5. Check for an existing request in either direction
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "A connection request already exists between these users",
        });
      }

      // 6. Create and save the connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      res.status(401).send("ERROR " + err.message);
    }
  },
);

// To accept or reject the connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const { status, requestId } = req.params;

      // Validate Status
      const allowedList = ["accepted", "rejected"];

      if (!allowedList.includes(status)) {
        return res.status(400).json({ message: `Invalid status: ${status}` });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data,
      });
    } catch (err) {
      res.status(404).json({ message: "ERROR " + err.message });
    }
  },
);

module.exports = {
  requestRouter,
};
