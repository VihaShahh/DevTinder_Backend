import express from "express";
import mongoose from "mongoose";
import connectDb from "../src/config/database.js";
import User from "./models/user.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";

const app = express();
app.use(cookieParser())
// Middleware for parsing JSON
app.use(express.json());
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

// Ensure indexes are created after DB connection
mongoose.connection.on("connected", async () => {
  try {
    await User.syncIndexes();
    //console.log("Indexes synchronized!");
  } catch (err) {
    console.error("Index sync error:", err.message);
  }
});



// =========================
// Start Server After DB
// =========================
const startServer = async () => {
  try {
    await connectDb();

    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
