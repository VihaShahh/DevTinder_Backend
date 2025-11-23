import express from "express";
import connectDb from "../src/config/database.js";
import User from "./models/user.js";

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// =========================
// POST: Create User
// =========================
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// =========================
// GET: Find Users by emailId
// =========================
app.get("/allUsers", async (req, res) => {
  try {
    const userEmail = req.query.emailId;

    const users = await User.find({ emailId: userEmail });

    if (users.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't fetch users",
      error: error.message,
    });
  }
});

// =========================
// GET: Fetch All Users
// =========================
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't fetch users",
      error: error.message,
    });
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
