import express from "express";
import connectDb from "../src/config/database.js";
import User from "./models/user.js";

const app = express();

// middleware for parsing JSON body
app.use(express.json())

app.post("/signup", async (req, res) => {
  try {
    // Creating new instance of user model
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

// starting server only after DB connection
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
