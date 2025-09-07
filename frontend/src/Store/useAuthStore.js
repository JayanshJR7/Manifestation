import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import {io} from "socket.io-client"

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://manifestation-fqof.onrender.com";

export const userAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket : null,
 
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data })
      get().connectSocket()
    } catch (error) {
      console.log("Error in checking auth:", error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      // Clear any existing chat data before signup
      try {
        const { clearChatStore } = await import("./useChatStore.js")
        clearChatStore()
      } catch (error) {
        // Chat store might not be loaded yet, ignore error
      }

      const res = await axiosInstance.post("/auth/signup", data)
      set({ authUser: res.data })
      toast.success("Account created successfully")
      get().connectSocket()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed"
      toast.error(errorMessage)
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data)
      set({ authUser: res.data })
      toast.success("Successfully logged in")
      
      // Clear any existing chat data before connecting
      try {
        const { clearChatStore } = await import("./useChatStore.js")
        clearChatStore()
      } catch (error) {
        // Chat store might not be loaded yet, ignore error
      }
      
      get().connectSocket()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed"
      toast.error(errorMessage)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
      get().disconnectSocket()
      
      // Clear chat store on logout
      try {
        const { clearChatStore } = await import("./useChatStore.js")
        clearChatStore()
      } catch (error) {
        // Chat store might not be loaded yet, ignore error
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed"
      toast.error(errorMessage)
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put("/auth/update-profile", data)
      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed"
      toast.error(errorMessage)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  removeProfilePic: async () => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put("/auth/update-profile", {
        profilePic: "",
      })
      set({ authUser: res.data })
      toast.success("Profile picture removed")
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove profile picture"
      toast.error(errorMessage)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get()
    
    // Prevent multiple connections
    if (!authUser || (socket && socket.connected)) {
      console.log("Socket already connected or no auth user")
      return
    }

    console.log("Connecting socket for user:", authUser._id)
    
    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    })

    // Remove any existing listeners before adding new ones
    newSocket.removeAllListeners()

    set({ socket: newSocket })

    // Listen for online users
    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("Online users updated:", userIds)
      set({ onlineUsers: userIds })
    })

    // Listen for new messages
    newSocket.on("newMessage", (message) => {
      console.log("New message received:", message)
      // Don't show toast for messages from the current user
      const { authUser } = get()
      if (message.senderId !== authUser._id) {
        toast.success("New message received!")
      }
    })

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
    })
  },

  disconnectSocket: ()=>{
    if(get().socket?.connected) {
      get().socket.disconnect()
      set({socket: null, onlineUsers: []})
    }
  }
}))