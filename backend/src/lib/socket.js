import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{  
        origin:["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {}

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    
    // Make sure to use consistent naming - 'userId' not 'userID'
    const userId = socket.handshake.query.userId
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id
        console.log(`User ${userId} mapped to socket ${socket.id}`)
        
        // Broadcast updated online users list to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }

    // Handle real-time messaging
    socket.on("sendMessage", (messageData) => {
        const receiverSocketId = getReceiverSocketId(messageData.receiverId)
        if (receiverSocketId) {
            // Send message to specific receiver
            io.to(receiverSocketId).emit("newMessage", messageData)
        }
    })

    // Handle typing indicators (optional)
    socket.on("typing", (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", {
                senderId: data.senderId,
                isTyping: data.isTyping
            })
        }
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        
        // Find and remove the user from the map
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[userId]
                console.log(`User ${userId} removed from online users`)
                break
            }
        }
        
        // Broadcast updated online users list
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { io, server, app }