import express from "express"
import validator from "validator";
import { validateSignup } from "../middleware/middleware.js";
import User from "../models/user.js";
import bcrypt from "bcrypt"
const authRouter = express.Router()

// =========================
// POST: Create User
// =========================
authRouter.post("/signup", validateSignup, async (req, res) => {
    try {

        //encrypt the password
        const { firstName, lastName, emailId, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        });
        await user.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {

        // Duplicate Email Handling
        if (error.code == 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});


// =========================
// POST: Login User
// =========================  
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId) {
            return res.status(400).json({ success: false, message: "Email id is required" });
        }

        if (!validator.isEmail(emailId)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = user.generateToken();

        // Set token in cookies
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
})
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logged out successfully")
});

export default authRouter