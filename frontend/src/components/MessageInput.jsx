import { useRef, useState } from "react"
import { useChatStore } from "../Store/useChatStore"
import { Image, Send, X, Smile } from "lucide-react"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useThemeStore } from "../Store/useThemeStore";

const MessageInput = () => {
  const [Text, setText] = useState("")
  const [ImagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef(null)
  const inputRef = useRef(null)
  const { sendMessage, selectedUser } = useChatStore()
  const { theme } = useThemeStore();


  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
    "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
    "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
    "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥"
  ]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleEmojiSelect = (emoji) => {
    const input = inputRef.current
    if (input) {
      const start = input.selectionStart
      const end = input.selectionEnd
      const newText = Text.slice(0, start) + emoji + Text.slice(end)
      setText(newText)

      setTimeout(() => {
        input.focus()
        input.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
    } else {
      setText(Text + emoji)
    }
    // ❌ Removed auto-close here
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!Text.trim() && !ImagePreview) return
    if (!selectedUser) {
      toast.error("Please select a user to send message to")
      return
    }

    setIsLoading(true)
    try {
      await sendMessage({ text: Text.trim(), image: ImagePreview })
      setText("")
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("Failed to send message", error)
      toast.error("Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 w-full relative bg-transparent">
      {ImagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={ImagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <>
            <motion.div
              initial={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute bottom-20 left-4 bg-base-200 rounded-lg p-3 shadow-lg border border-base-300 z-50 w-80 max-h-60 overflow-y-auto"
            >
              <div className="grid grid-cols-8 gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-2 hover:bg-base-300 rounded-md transition-colors text-xl"
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowEmojiPicker(false)}
            />
          </>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className={`w-full bg-transparent border border-zinc-300 dark:border-zinc-600 rounded-lg px-4 py-3 text-sm 
                        ${theme === "dark"
        ? "border-r border-slate-800   bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
        : "bg-gradient-to-b from-slate-50 via-white to-slate-100 border-r border-slate-300"}`}
            placeholder="Type a message"
            value={Text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isLoading}
          />

          {/* Emoji Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            type="button"
            className={`w-10 h-10 rounded-full bg-transparent border border-zinc-300 dark:border-zinc-600 
                       flex items-center justify-center transition-all duration-200 hover:border-indigo-500 
                       backdrop-blur-sm ${showEmojiPicker ? "text-indigo-500" : "text-zinc-500 dark:text-zinc-400"}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isLoading}
          >
            <Smile size={20} />
          </motion.button>

          {/* Image Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            type="button"
            className={`hidden sm:flex w-10 h-10 rounded-full bg-transparent border border-zinc-300 dark:border-zinc-600 
                       items-center justify-center transition-all duration-200 hover:border-indigo-500 
                       backdrop-blur-sm ${ImagePreview ? "text-indigo-500" : "text-zinc-500 dark:text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Image size={20} />
          </motion.button>
        </div>

        {/* Send Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          type="submit"
          className="w-10 h-10 rounded-full bg-transparent border border-zinc-300 dark:border-zinc-600 
                     flex items-center justify-center transition-all duration-200 
                     backdrop-blur-sm hover:border-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-zinc-500 dark:text-zinc-400 hover:text-indigo-500"
          disabled={(!Text.trim() && !ImagePreview) || isLoading}
        >
          <Send size={20} />
        </motion.button>
      </form>
    </div>
  )
}

export default MessageInput