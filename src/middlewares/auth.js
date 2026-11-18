const jwt = require("jsonwebtoken");
const User = require("../models/user");

    const userAuth = async (req, res, next) => {
        try {
       const { token } = req.cookies;
       if (!token) {
         return res.status(401).json("Please Login!");
       }
       const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
       const {_id} = decodedObj;
       const user = await User.findById(_id);
       if (!user) {
         return res.status(401).json({ "ERROR:": "User not found. Please Login!" });
       }
       req.user = user; // Attach the user object to the request for further use
       next();
    } catch (err) {
        // Invalid or expired token -> 401 so the frontend redirects to /login
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
          return res.status(401).json({ "ERROR:": "Invalid or expired token. Please Login!" });
        }
        res.status(500).json({ "ERROR:": err.message });
    }
    }
    module.exports = { userAuth };