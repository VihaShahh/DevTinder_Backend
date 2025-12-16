import { validateSignupData } from "../utils/validation.js";
import jwt from "jsonwebtoken"
import User from "../models/user.js"
export const validateSignup = (req, res, next) => {
    try {
        validateSignupData(req)
        next()
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token found" });
        }

        const decoded = jwt.verify(token, "Dev@Tinder@124");

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};