import express from "express"
const profileRouter = express.Router()
import { userAuth } from "../middleware/middleware.js"
import { validateProfileData } from "../utils/validation.js";
import User from "../models/user.js"
import bcrypt from "bcrypt"
import validator from "validator";

// =========================
// GET: User Profile (Protected)
// =========================  

profileRouter.get("/profile/view", userAuth, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: req.user
    });
});

// =========================
// PATCH: Update Profile (Protected)
// =========================  
profileRouter.patch("/profile/update", userAuth, async (req, res) => {
    try {
        const allowedFields = ["firstName", "lastName", "age", "gender", "about", "photoUrl"];

        allowedFields.forEach(key => {
            if (req.body[key] !== undefined) {
                req.user[key] = req.body[key];
            }
        });

        await req.user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: req.user
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});


// =========================
// PATCH: Reset Password by Email
// =========================  
profileRouter.patch("/profile/resetPassword", async (req, res) => {
    try {
        const { emailId, newPassword } = req.body;

        if (!emailId || !newPassword) {
            throw new Error("Email and newPassword are required");
        }

        // Validate BEFORE hashing
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Password must be strong");
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Email");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

export default profileRouter;