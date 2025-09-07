import { useChatStore } from '../Store/useChatStore'
import { useEffect, useState, useRef } from 'react'
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import MessageSkeleton from './Skeletons/MessageSkeleton'
import { userAuthStore } from '../Store/useAuthStore'
import { Trash2, MoreVertical } from 'lucide-react'
import { useThemeStore } from "../Store/useThemeStore";


const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, deleteMessage, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser } = userAuthStore()
  const [showDropdown, setShowDropdown] = useState(null)
  const [deletingMessages, setDeletingMessages] = useState(new Set())
  const { theme } = useThemeStore();
  const messageEndRef = useRef(null)

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id)
      subscribeToMessages()
      return () => unsubscribeFromMessages()
    }
  }, [selectedUser?._id, getMessages, unsubscribeFromMessages, subscribeToMessages])

  const handleDeleteMessage = async (messageId) => {
    setDeletingMessages(prev => new Set([...prev, messageId]))
    setShowDropdown(null)

    setTimeout(async () => {
      await deleteMessage(messageId)
      setDeletingMessages(prev => {
        const newSet = new Set(prev)
        newSet.delete(messageId)
        return newSet
      })
    }, 600)
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (isMessagesLoading) return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )

  if (!selectedUser) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Chat!</h3>
        <p className="text-gray-500">Please select a user to start chatting</p>
      </div>
    </div>
  )

  return (
    <div className={`flex-1 flex flex-col overflow-x-hidden 
                    bg-base-200 dark:bg-[#0a0f1c] 
                    transition-colors duration-300
                    ${theme === "dark"
                    ? "border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
                    : "border-slate-300 bg-gradient-to-b from-slate-50 via-white to-slate-100"}`}>
      <ChatHeader />

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 
                      bg-base-100 dark:bg-[#0d1124] 
                      transition-colors duration-300
                      ${theme === "dark"
                    ? "border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
                    : "border-slate-300 bg-gradient-to-b from-slate-50 via-white to-slate-100 "}
                      `}>
        {messages.map((message) => {
          const isMyMessage = message.senderId === authUser._id
          const isDeleting = deletingMessages.has(message._id)

          return (
            <div
              key={message._id}
              className={`chat ${isMyMessage ? "chat-end" : "chat-start"} relative`}
              ref={messageEndRef}
              style={{ isolation: showDropdown === message._id ? 'auto' : 'isolate' }}
            >
              <div className={`message-wrapper ${isDeleting ? 'deleting' : 'appearing'}`}>
                {/* Avatar */}
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border border-base-300">
                    <img
                      src={isMyMessage ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                      alt="profile pic"
                    />
                  </div>
                </div>

                {/* Header + Dropdown */}
                <div className="chat-header mb-1 flex items-center gap-2 text-xs opacity-70 relative z-20">
                  <time>{formatTime(message.createdAt)}</time>

                  {isMyMessage && !isDeleting && (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === message._id ? null : message._id)}
                        className="opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-base-200"
                      >
                        <MoreVertical size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`chat-bubble max-w-xs relative z-10
                              ${isMyMessage
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "bg-base-300 text-base-content"} 
                              transition-colors duration-300`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Message attachment"
                      className="max-w-full rounded-md mb-2"
                    />
                  )}
                  {message.text && <p className="break-words">{message.text}</p>}
                </div>
              </div>

              {/* Dropdown rendered outside the normal flow */}
              {isMyMessage && !isDeleting && showDropdown === message._id && (
                <div
                  className="absolute top-8 right-0 mt-1 
                           bg-base-100 border border-base-300 
                           rounded-md shadow-lg 
                           z-50 min-w-[120px]"
                >
                  <button
                    onClick={() => handleDeleteMessage(message._id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 
                             hover:bg-red-50 dark:hover:bg-red-900/30 
                             flex items-center gap-2 rounded-md"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <MessageInput />

      {/* Animations */}
      <style jsx>{`
        .appearing {
          animation: fadeInScale 0.3s ease-out;
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .deleting {
          animation: fadeOutShrink 0.6s ease forwards;
        }
        @keyframes fadeOutShrink {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.8) translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

export default ChatContainer