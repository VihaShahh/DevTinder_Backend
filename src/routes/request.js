import express from "express"
const requestRouter = express.Router()
import { userAuth } from "../middleware/middleware.js"
import ConnectionRequest from "../models/connectionRequest.js"
import User from "../models/user.js"

// =========================
// POST: Send the Connection Request - swipe left-right
// =========================
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedstatus = ["ignored", "interested"]
        if (!allowedstatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status type " + status
            })
        }

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exists."
            });
        }

        const request = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await request.save();
        res.status(200).json({
            success: true,
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { requestId, status } = req.params
        const allowedstatus = ["accepted", "rejected"]
        if (!allowedstatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status type" + status
            })
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })
        if (!connectionRequest) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found"
            })
        }

        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.status(200).json({
            success: true,
            message: "Connection request " + status
                + " successfully"
        })
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})
export default requestRouter