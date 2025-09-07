import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Helper function to check if two users are friends
const areUsersFriends = async (userId1, userId2) => {
    const user1 = await User.findById(userId1);
    return user1 && user1.friends.includes(userId2);
};

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Get current user with friends populated
        const currentUser = await User.findById(loggedInUserId)
            .populate('friends', 'fullName email profilePic')
            .select('friends');

        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return only friends instead of all users
        res.status(200).json(currentUser.friends);
        
    } catch (error) {
        console.log("Error in getUsersForSidebar :", error.message);
        res.status(500).json({error:"Internal server error"})
        
    }   
}

export const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id

        // Check if users are friends before allowing to view messages
        const areFriends = await areUsersFriends(myId, userToChatId);
        if (!areFriends) {
            return res.status(403).json({ 
                error: 'You can only view messages with your friends' 
            });
        }

        //to find all the messages where the sender is me or the sender is the same person 
        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId},
            ]
        })

        //return the status code 200 and all the messages which we fetched
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller :",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}

//sending a message it can be either a image or a text
export const sendMessage = async (req,res) => {
    try {
        const {text,image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id

        // Check if users are friends before allowing to send message
        const areFriends = await areUsersFriends(senderId, receiverId);
        if (!areFriends) {
            return res.status(403).json({ 
                error: 'You can only send messages to your friends' 
            });
        }

        let imageUrl;

        //if user sends a image then --->
        if(image){
            //upload the base64 image to the cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        //then we will create the message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save() //saving the message to the database

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage) //emit broadcasts it to all the users , the to() in between ensures that the message is sent in real time to the given person only
        }

        res.status(201).json(newMessage)
        //res status 201 says the resource has been created

    } catch (error) {
        console.log("Error in send message controller :", error.message);
        res.status(500).json({error:"Internal server error"})
    }
}

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params
        const userId = req.user._id

        // Find the message and check if the user is the sender
        const message = await Message.findById(messageId)
        
        if (!message) {
            return res.status(404).json({ error: "Message not found" })
        }

        // Only allow the sender to delete the message
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You can only delete your own messages" })
        }

        // Additional check: verify users are still friends
        const areFriends = await areUsersFriends(message.senderId, message.receiverId);
        if (!areFriends) {
            return res.status(403).json({ 
                error: "You can only delete messages between friends" 
            });
        }

        // If message has an image, you might want to delete it from cloudinary too
        if (message.image) {
            // Extract public_id from cloudinary URL and delete
            const publicId = message.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(publicId)
        }

        // Delete the message from database
        await Message.findByIdAndDelete(messageId)

        // IMPORTANT: Emit socket event to both sender and receiver
        const senderSocketId = getReceiverSocketId(message.senderId.toString())
        const receiverSocketId = getReceiverSocketId(message.receiverId.toString())

        // Notify sender
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", messageId)
        }

        // Notify receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", messageId)
        }

        res.status(200).json({ message: "Message deleted successfully" })

    } catch (error) {
        console.log("Error in delete message controller:", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}