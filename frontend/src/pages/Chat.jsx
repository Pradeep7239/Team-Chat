import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { connectSocket } from "../socket";

export default function Chat() {
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [socket, setSocket] = useState(null);

  // Route Protection
  useEffect(() => {
    const token = localStorage.getItem("teamchat_token");
    if (!token) navigate("/");
  }, []);

  // Connect socket
  useEffect(() => {
    const s = connectSocket();
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar onSelectChannel={setSelectedChannel} socket={socket} />

      <div className="flex-1">
        {selectedChannel ? (
          <ChatWindow channelId={selectedChannel} socket={socket} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
