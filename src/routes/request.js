const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); // Import the userAuth middleware


requestsRouter.post("/requests", async (req, res) => {
    const user = req.user;

    res.send("Request sent successfully");
});

module.exports = requestsRouter;