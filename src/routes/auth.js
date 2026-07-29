const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //  Validation of data
    validateSignupData(req); // Helper or Utility function
    const { firstName, lastName, emailId, password } = req.body;
    //  Encrypt the Password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password Hash:", passwordHash);

    // // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully !");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password); // Call the validatePassword method on the user instance to check if the password is valid
    if (isPasswordValid) {
      //  Create a JWT token
      const token = await user.getJWT(); // Call the getJWT method on the user instance to generate a token

      //  Add the token to the Cookie and send it to the client
      res.cookie("token", token); //Express feature
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) }); // Set the token cookie to an empty string and set its expiration date to a past date
  res.send("Logout successful");
});

module.exports = authRouter;
