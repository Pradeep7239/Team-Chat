import { useEffect, useState, useRef } from "react";
import API from "../api";

export default function ChatWindow({ channelId, socket }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  const typingTimeout = useRef(null);

  // Load message history
  useEffect(() => {
    const load = async () => {
      const res = await API.get(`/messages/channel/${channelId}`);
      setMessages(res.data);
    };
    load();
  }, [channelId]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const messageHandler = (message) => {
      if (message.channel === channelId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const typingHandler = (data) => {
      if (data.channelId !== channelId) return;

      setTypingUsers((prev) => {
        const exists = prev.find((u) => u.userId === data.userId);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    const stopTypingHandler = (data) => {
      if (data.channelId !== channelId) return;

      setTypingUsers((prev) =>
        prev.filter((u) => u.userId !== data.userId)
      );
    };

    socket.on("message:new", messageHandler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);

    return () => {
      socket.off("message:new", messageHandler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
    };
  }, [socket, channelId]);

  // Send typing event
  const handleTyping = (e) => {
    setMsg(e.target.value);

    socket.emit("typing", { channelId });

    // Stop typing after 1 second of inactivity
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { channelId });
    }, 1000);
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    socket.emit("message:send", {
      channelId,
      text: msg,
    });

    socket.emit("stopTyping", { channelId });
    setMsg("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b bg-white">
        <p className="font-bold">Channel</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-auto space-y-3">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className="bg-white p-3 rounded shadow-sm">
            <p className="text-sm text-gray-500">
              {m.sender?.displayName || m.sender?.username}
            </p>
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="p-2 text-sm text-gray-500">
          {typingUsers.map((u) => u.username).join(", ")}{" "}
          {typingUsers.length === 1 ? "is typing..." : "are typing..."}
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t bg-white flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
          value={msg}
          onChange={handleTyping}
        />
        <button className="px-4 bg-blue-600 text-white rounded">Send</button>
      </form>
    </div>
  );
}
