import express from "express"
const requestRouter = express.Router()
import { userAuth } from "../middleware/middleware.js"

// =========================
// POST: Send the Connection Request
// =========================

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send("Connection request sent successfully to " + user.firstName)
})


export default requestRouter