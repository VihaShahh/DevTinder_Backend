import express from "express"
const profileRouter = express.Router()
import { userAuth } from "../middleware/middleware.js"

// =========================
// GET: User Profile (Protected)
// =========================  

profileRouter.get("/profile", userAuth, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: req.user
    });
});

export default profileRouter