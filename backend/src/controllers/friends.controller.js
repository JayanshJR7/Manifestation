import User from "../models/user.model.js";

// Search for users to add as friends
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query; // search query
        const currentUserId = req.user._id;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        
        const users = await User.searchUsersForFriends(currentUserId, q.trim());
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in search users:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Send friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUser = await User.findById(req.user._id);
        
        if (!targetUserId) {
            return res.status(400).json({ error: 'Target user ID is required' });
        }
        
        await currentUser.sendFriendRequest(targetUserId);
        
        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error sending friend request:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Get pending friend requests (received)
export const getReceivedRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friendRequestsReceived.from', 'fullName email profilePic');
        
        res.status(200).json(user.friendRequestsReceived);
    } catch (error) {
        console.error('Error getting received requests:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get sent friend requests
export const getSentRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friendRequestsSent.to', 'fullName email profilePic');
        
        res.status(200).json(user.friendRequestsSent);
    } catch (error) {
        console.error('Error getting sent requests:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { senderUserId } = req.body;
        const currentUser = await User.findById(req.user._id);
        
        if (!senderUserId) {
            return res.status(400).json({ error: 'Sender user ID is required' });
        }
        
        await currentUser.acceptFriendRequest(senderUserId);
        
        res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error('Error accepting friend request:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
    try {
        const { senderUserId } = req.body;
        const currentUser = await User.findById(req.user._id);
        
        if (!senderUserId) {
            return res.status(400).json({ error: 'Sender user ID is required' });
        }
        
        await currentUser.rejectFriendRequest(senderUserId);
        
        res.status(200).json({ message: 'Friend request rejected successfully' });
    } catch (error) {
        console.error('Error rejecting friend request:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Get friends list
export const getFriendsList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friends', 'fullName email profilePic');
        
        res.status(200).json(user.friends);
    } catch (error) {
        console.error('Error getting friends list:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove friend
export const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const currentUser = await User.findById(req.user._id);
        
        if (!friendId) {
            return res.status(400).json({ error: 'Friend ID is required' });
        }
        
        await currentUser.removeFriend(friendId);
        
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Check friendship status with another user
export const getFriendshipStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUser = await User.findById(req.user._id);
        
        // Check if they're friends
        const isFriend = currentUser.friends.includes(userId);
        if (isFriend) {
            return res.status(200).json({ status: 'friends' });
        }
        
        // Check if request was sent
        const requestSent = currentUser.friendRequestsSent.some(req => 
            req.to.toString() === userId
        );
        if (requestSent) {
            return res.status(200).json({ status: 'request_sent' });
        }
        
        // Check if request was received
        const requestReceived = currentUser.friendRequestsReceived.some(req => 
            req.from.toString() === userId
        );
        if (requestReceived) {
            return res.status(200).json({ status: 'request_received' });
        }
        
        // No relationship
        res.status(200).json({ status: 'none' });
    } catch (error) {
        console.error('Error checking friendship status:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};