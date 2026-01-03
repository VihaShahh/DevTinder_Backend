import express from "express";
import mongoose from "mongoose";
import connectDb from "../src/config/database.js";
import User from "./models/user.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

// Ensure indexes are created after DB connection
mongoose.connection.on("connected", async () => {
  try {
    await User.syncIndexes();
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

    app.listen(3000, "0.0.0.0", () => {
      console.log("Server running on http://localhost:3000");
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();