require("dotenv").config({ quiet: true }); // Load .env before anything else reads process.env

// Stop early with a clear message if required configuration is missing
const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET", "CLIENT_URL"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missingEnvVars.join(", ")}. ` +
      "Copy .env.example to .env and fill in the values.",
  );
  process.exit(1);
}

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser"); // Middleware to parse cookies
const connectDB = require("./config/database");
const cors = require("cors");

app.use(cors(
  {
    origin: process.env.CLIENT_URL, // React frontend URL
    credentials:true, // Allow credentials (cookies) to be sent
  }
));
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
