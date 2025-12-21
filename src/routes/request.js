import express from "express"
const requestRouter = express.Router()
import { userAuth } from "../middleware/middleware.js"
import ConnectionRequest from "../models/connectionRequest.js"

// =========================
// POST: Send the Connection Request
// =========================

// requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
//     const user = req.user;
//     res.send("Connection request sent successfully to " + user.firstName)
// })
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const request = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await request.save();
        res.status(200).json({
            success: true,
            message: "Connection request sent successfully",
            data
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


export default requestRouter