const express = require("express");
const app = express();
const cookieParser = require("cookie-parser"); // Middleware to parse cookies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // For generating and verifying JWT tokens
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth"); // Import the userAuth middleware

app.use(express.json());
app.use(cookieParser()); // Use the cookie parser middleware
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});
//  Feed API - GET  /feed  - get all the users from the database

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching the user:" + err.message);
  }
});

app.get("/userId", async (req, res) => {
  const userId = req.body._id;
  try {
    const users = await User.findById(userId);
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching the user:" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error fetching the user:" + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid updates");
    }
    if (data.skills.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update failed:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
