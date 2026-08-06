const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "about", "gender", "skills"]; 
// Get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser =  req.user; 
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age about gender skills"); // Populate the fromUserId field with user details
        //  }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        })
    }catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
const loggedInUser =  req.user;
const connectionRequests = await ConnectionRequestModel.find({
    $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" }
    ]
}).populate("fromUserId", USER_SAFE_DATA)
const data = connectionRequests.map(row => row.fromUserId);
res.json({
    data,
    message: "Connections fetched successfully"
})


}catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;