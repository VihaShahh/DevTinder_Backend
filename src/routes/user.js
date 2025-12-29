import express from "express";
import { userAuth } from "../middleware/middleware.js"
const userRouter = express.Router();
import ConnectionRequest from "../models/connectionRequest.js"
import User from "../models/user.js"

const userSafeFields = ["firstName", "lastName", "photoUrl", "about", "skills"]

//get all the pending connection requests for the logged in user
userRouter.get("/user/requets/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", userSafeFields)

        res.json({
            success: true,
            data: connectionRequests,
            message: "Data fetched successfully",
        })
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/users/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", userSafeFields)
            .populate("toUserId", userSafeFields);
        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });

        res.json({
            success: true,
            data,
            message: "Data fetched successfully"
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

//get the feed for the logged in user
userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId").populate("fromUserId", "firstName").populate("toUserId", "firstName")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId._id.toString())
            hideUsersFromFeed.add(req.toUserId._id.toString())
        })

        const users = await User.find({
            $and: [
                {
                    _id: {
                        $nin: Array.from(hideUsersFromFeed)
                    }
                },
                {
                    _id: {
                        $ne: loggedInUser._id
                    }
                },
            ],
        }).select(userSafeFields).skip(skip).limit(limit)

        res.json({
            success: true,
            users,
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

export default userRouter;

