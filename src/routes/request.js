const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); // Import the userAuth middleware
const ConnectionRequest = require("../models/connectionRequest"); // Import the ConnectionRequest model
const User = require("../models/user"); // Import the User model
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // Get the authenticated user's ID from the request
      const toUserId = req.params.toUserId; // Get the target user's ID from the request parameters
      const status = req.params.status; // Get the status from the request parameters
      const allowedStatuses = ["ignored", "interested"];

      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      //  If there is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists between these users",
        });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({

        message: "Connection request sent successfully",
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = requestsRouter;
