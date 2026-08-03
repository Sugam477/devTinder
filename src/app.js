const express = require("express");
const app = express();
const cookieParser = require("cookie-parser"); // Middleware to parse cookies
const connectDB = require("./config/database");

app.use(express.json());
app.use(cookieParser()); // Use the cookie parser middleware

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);




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
