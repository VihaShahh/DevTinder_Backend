import express from "express"
const profileRouter = express.Router()
import { userAuth } from "../middleware/middleware.js"
import { validateProfileData } from "../utils/validation.js";
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

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
    try {
        if (!validateProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        await loggedInUser.save()

        console.log(loggedInUser)
        res.status(200).json({
            success: true,
            message: "Profile update request is valid",
            data: loggedInUser
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

export default profileRouter