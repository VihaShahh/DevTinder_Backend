import validateSignupData from "../utils/validation.js";

export const validateSignup = (req, res, next) => {
    try {
        validateSignupData(req)
        next()
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}