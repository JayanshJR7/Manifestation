import { useChatStore } from "../Store/useChatStore"
import Sidebar from "../components/Sidebar.jsx"
import NoChatSelected from "../components/NoChatSelected.jsx"
import ChatContainer from "../components/ChatContainer.jsx"

const Homepage = () => {
  const { selectedUser } = useChatStore()
  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center w-full justify-center pt-20 px-1">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-7.5xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage