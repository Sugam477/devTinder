const jwt = require("jsonwebtoken");
const User = require("../models/user");

    const userAuth = async (req, res, next) => {
        try {
       const { token } = req.cookies;
       if (!token) {
         throw new Error("Token is not valid or not found in cookies");
       }
       const decodedObj = await jwt.verify(token, "mysecretkey");
       const {_id} = decodedObj;
       const user = await User.findById(_id);
       if (!user) {
         throw new Error("User not found");
       }
       req.user = user; // Attach the user object to the request for further use
       next();
    } catch (err) {
        res.status(400).json({ "ERROR:" : err.message });
    }
    }
    module.exports = { userAuth };