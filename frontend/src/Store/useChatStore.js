import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { userAuthStore } from "./useAuthStore.js"

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/messages/users")
      set({ users: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
      
      // Add message to local state immediately (for sender)
      set({ messages: [...messages, res.data] })
      
      // DON'T emit through socket here - the backend already handles socket emission
      
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  // Delete message function - DON'T update local state immediately
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`)
      
      // DON'T remove from local state here - let the socket event handle it
      // This ensures both users see the deletion at the same time
      
      toast.success("Message deleted successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message")
    }
  },

  // Handle message deletion from socket event
  removeMessage: (messageId) => {
    const { messages } = get()
    set({ messages: messages.filter(msg => msg._id !== messageId) })
  },

  // This function will be called when receiving real-time messages
  addMessage: (message) => {
    const { messages, selectedUser } = get()
    const { authUser } = userAuthStore.getState()
    
    // Prevent adding duplicate messages
    const messageExists = messages.some(msg => 
      msg._id === message._id || 
      (msg.text === message.text && msg.senderId === message.senderId && 
       Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 1000)
    )
    
    if (messageExists) return
    
    // Only add to messages if it's relevant to current conversation
    if (selectedUser && 
        ((message.senderId === selectedUser._id && message.receiverId === authUser._id) ||
         (message.senderId === authUser._id && message.receiverId === selectedUser._id))) {
      set({ messages: [...messages, message] })
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Subscribe to socket events (call this after socket connection)
  subscribeToMessages: () => {
    const socket = userAuthStore.getState().socket
    if (!socket) return

    socket.on("newMessage", (message) => {
      get().addMessage(message)
    })

    // IMPORTANT: Listen for message deletion events
    socket.on("messageDeleted", (messageId) => {
      get().removeMessage(messageId)
    })
  },

  // Unsubscribe from socket events
  unsubscribeFromMessages: () => {
    const socket = userAuthStore.getState().socket
    if (!socket) return

    socket.off("newMessage")
    socket.off("messageDeleted") // Don't forget to clean up this listener
  },

  // Clear all chat data (call this on logout/signup)
  clearChatData: () => {
    set({
      messages: [],
      users: [],
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,
    })
  },
}))

// Export a function to clear chat store from outside
export const clearChatStore = () => {
  useChatStore.getState().clearChatData()
}