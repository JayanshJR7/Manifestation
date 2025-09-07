import { useEffect } from "react";
import { useChatStore } from "../Store/useChatStore";
import SidebarSkeleton from "../components/Skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useThemeStore } from "../Store/useThemeStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  const { theme } = useThemeStore();

  const onlineUsers = [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full w-20 lg:w-72 flex flex-col transition-all shadow-xl overflow-hidden border
        ${
          theme === "dark"
            ? "border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
            : "border-slate-300 bg-gradient-to-b from-slate-50 via-white to-slate-100"
        }`}
    >
      {/* Header */}
      <div
        className={`w-full p-5 border-b 
          ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <Users className="size-6 text-indigo-500 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]" />
          <span
            className="hidden lg:block font-semibold text-lg bg-gradient-to-r 
              from-indigo-500 via-blue-500 to-purple-500 bg-clip-text text-transparent 
              drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]"
          >
            Manifest
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto overflow-x-hidden w-full py-3 custom-scroll">
        {users.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 rounded-lg transition-all duration-300 transform-gpu
                ${
                  isSelected
                    ? theme === "dark"
                      ? "bg-indigo-950/60 ring-2 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                      : "bg-indigo-100 ring-2 ring-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                    : theme === "dark"
                    ? "hover:bg-indigo-900/40 hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                    : "hover:bg-indigo-50 hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                }
              `}
            >
              {/* Profile */}
              <div className="relative flex-shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className={`size-12 object-cover rounded-full border 
                    ${theme === "dark" ? "border-slate-700" : "border-slate-300"}`}
                />
              </div>

              {/* User info */}
              <div className="text-left min-w-0">
                <div
                  className={`font-medium truncate capitalize
                    ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                >
                  {user.fullName}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom scrollbar */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.4);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
