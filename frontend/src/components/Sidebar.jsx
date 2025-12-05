import { useEffect, useState } from "react";
import API from "../api";

export default function Sidebar({ onSelectChannel, socket }) {
  const [channels, setChannels] = useState([]);
  const [newName, setNewName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("teamchat_user"));

  // Load channels from backend
  const loadChannels = async () => {
    try {
      const res = await API.get("/channels");
      setChannels(res.data);
    } catch (err) {
      console.error("Error loading channels:", err);
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  // Listen for presence updates from socket
  useEffect(() => {
    if (!socket) return;

    const handler = (onlineList) => {
      setOnlineUsers(onlineList);
    };

    socket.on("presence:update", handler);

    return () => socket.off("presence:update", handler);
  }, [socket]);

  const createChannel = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await API.post("/channels", { name: newName });
    setNewName("");
    loadChannels();
  };

  const logout = () => {
    localStorage.removeItem("teamchat_token");
    localStorage.removeItem("teamchat_user");
    window.location.href = "/";
  };

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      {/* User */}
      <div className="p-4 border-b">
        <p className="font-bold">{user?.displayName || user?.username}</p>

        <button
          onClick={logout}
          className="text-sm text-red-600 mt-1 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Online Users */}
      <div className="p-3 border-b">
        <h3 className="font-semibold mb-2">Online</h3>
        <ul className="space-y-1 max-h-40 overflow-auto">
          {onlineUsers.length === 0 && (
            <p className="text-gray-500 text-sm">No users online</p>
          )}

          {onlineUsers.map((u) => (
            <li key={u.id} className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>{u.displayName || u.username}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Channel */}
      <form onSubmit={createChannel} className="p-3 border-b">
        <input
          className="w-full p-2 border rounded"
          placeholder="New channel name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>

      {/* Channel List */}
      <div className="flex-1 overflow-auto">
        {channels.map((ch) => (
          <div
            key={ch._id}
            onClick={() => {
              onSelectChannel(ch._id);
              socket?.emit("joinChannel", ch._id);
            }}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
          >
            <p className="font-semibold">{ch.name}</p>
            <p className="text-sm text-gray-500">
              {ch.memberCount || 0} members
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
