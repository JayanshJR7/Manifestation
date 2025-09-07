import express from "express";
import { 
    searchUsers, 
    sendFriendRequest, 
    getReceivedRequests, 
    getSentRequests,
    acceptFriendRequest, 
    rejectFriendRequest, 
    getFriendsList, 
    removeFriend, 
    getFriendshipStatus 
} from "../controllers/friends.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected - users must be logged in
router.get("/search", protectRoute, searchUsers);

router.post("/request", protectRoute, sendFriendRequest);

router.get("/requests/received", protectRoute, getReceivedRequests);

router.get("/requests/sent", protectRoute, getSentRequests);

router.post("/request/accept", protectRoute, acceptFriendRequest);

router.post("/request/reject", protectRoute, rejectFriendRequest);

router.get("/list", protectRoute, getFriendsList);

router.delete("/remove", protectRoute, removeFriend);

router.get("/status/:userId", protectRoute, getFriendshipStatus);

export default router;