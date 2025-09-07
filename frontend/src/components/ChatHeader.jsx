import { X } from "lucide-react";
import { useChatStore } from "../Store/useChatStore";
import { userAuthStore } from "../Store/useAuthStore";
import { useThemeStore } from "../Store/useThemeStore";


const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = userAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const { theme } = useThemeStore();


  return (
    <div className={`px-4 py-3 bg-transparent backdrop-blur-sm border
       ${theme === "dark"
        ? "border-r border-slate-800   bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
        : "bg-gradient-to-b from-slate-50 via-white to-slate-100 border-r border-slate-300"} `}>
      <div className={`flex items-center justify-between  transition-all duration-300`}>
        {/* Left Side - Avatar + Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent overflow-hidden">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online indicator */}
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col">
            <h3 className={`text-sm font-semibold capitalize
               ${theme === "dark"
                ? "text-white"
                : "text-black"} 
              `}>
              {selectedUser.fullName}
            </h3>
            <span className={`text-xs font-medium ${isOnline ? "text-green-500" : "text-zinc-500 dark:text-zinc-400"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full bg-transparent border border-zinc-300/50 dark:border-zinc-600/50 
                     hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50
                     text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200
                     transition-all duration-200 backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;