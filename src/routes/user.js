const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();


// Get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser =  req.user; 
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]); // Populate the fromUserId field with user details


        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        })




    }catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})


module.exports = userRouter;