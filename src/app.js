const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;
  // // Creating a new instance of the User model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User added successfully !");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
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
