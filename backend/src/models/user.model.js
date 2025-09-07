import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
        // Array of user IDs who are friends
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // Array of incoming friend requests
        friendRequestsReceived: [{
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        // Array of outgoing friend requests
        friendRequestsSent: [{
            to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
    },
    {
        timestamps: true
    }
);

// Instance method to send friend request
userSchema.methods.sendFriendRequest = async function(targetUserId) {
    // Check if already friends
    if (this.friends.includes(targetUserId)) {
        throw new Error('Already friends with this user');
    }
    
    // Check if request already sent
    const alreadySent = this.friendRequestsSent.some(req => 
        req.to.toString() === targetUserId.toString()
    );
    if (alreadySent) {
        throw new Error('Friend request already sent');
    }
    
    // Add to sender's sent requests
    this.friendRequestsSent.push({ to: targetUserId });
    await this.save();
    
    // Add to receiver's received requests
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        throw new Error('User not found');
    }
    
    targetUser.friendRequestsReceived.push({ from: this._id });
    await targetUser.save();
    
    return true;
};

// Instance method to accept friend request
userSchema.methods.acceptFriendRequest = async function(senderUserId) {
    // Find the request in received requests
    const requestIndex = this.friendRequestsReceived.findIndex(req => 
        req.from.toString() === senderUserId.toString()
    );
    
    if (requestIndex === -1) {
        throw new Error('Friend request not found');
    }
    
    // Remove from received requests
    this.friendRequestsReceived.splice(requestIndex, 1);
    
    // Add to friends list
    this.friends.push(senderUserId);
    await this.save();
    
    // Update sender's data
    const sender = await User.findById(senderUserId);
    if (sender) {
        // Remove from sender's sent requests
        const sentIndex = sender.friendRequestsSent.findIndex(req => 
            req.to.toString() === this._id.toString()
        );
        if (sentIndex !== -1) {
            sender.friendRequestsSent.splice(sentIndex, 1);
        }
        
        // Add to sender's friends list
        sender.friends.push(this._id);
        await sender.save();
    }
    
    return true;
};

// Instance method to reject friend request
userSchema.methods.rejectFriendRequest = async function(senderUserId) {
    // Remove from received requests
    const requestIndex = this.friendRequestsReceived.findIndex(req => 
        req.from.toString() === senderUserId.toString()
    );
    
    if (requestIndex === -1) {
        throw new Error('Friend request not found');
    }
    
    this.friendRequestsReceived.splice(requestIndex, 1);
    await this.save();
    
    // Remove from sender's sent requests
    const sender = await User.findById(senderUserId);
    if (sender) {
        const sentIndex = sender.friendRequestsSent.findIndex(req => 
            req.to.toString() === this._id.toString()
        );
        if (sentIndex !== -1) {
            sender.friendRequestsSent.splice(sentIndex, 1);
            await sender.save();
        }
    }
    
    return true;
};

// Instance method to remove friend
userSchema.methods.removeFriend = async function(friendId) {
    // Remove from current user's friends
    const friendIndex = this.friends.findIndex(id => 
        id.toString() === friendId.toString()
    );
    
    if (friendIndex === -1) {
        throw new Error('User is not in friends list');
    }
    
    this.friends.splice(friendIndex, 1);
    await this.save();
    
    // Remove from friend's friends list
    const friend = await User.findById(friendId);
    if (friend) {
        const currentUserIndex = friend.friends.findIndex(id => 
            id.toString() === this._id.toString()
        );
        if (currentUserIndex !== -1) {
            friend.friends.splice(currentUserIndex, 1);
            await friend.save();
        }
    }
    
    return true;
};

// Static method to search users (excluding current user and existing friends)
userSchema.statics.searchUsersForFriends = async function(currentUserId, searchQuery) {
    const currentUser = await this.findById(currentUserId);
    if (!currentUser) {
        throw new Error('Current user not found');
    }
    
    // Get list of user IDs to exclude (current user + friends + pending requests)
    const excludeIds = [
        currentUserId,
        ...currentUser.friends,
        ...currentUser.friendRequestsSent.map(req => req.to),
        ...currentUser.friendRequestsReceived.map(req => req.from)
    ];
    
    const users = await this.find({
        _id: { $nin: excludeIds },
        $or: [
            { fullName: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } }
        ]
    }).select('fullName email profilePic');
    
    return users;
};

const User = mongoose.model("User", userSchema);
export default User;