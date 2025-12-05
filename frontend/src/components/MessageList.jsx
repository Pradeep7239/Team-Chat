import React, { useEffect, useRef, useState } from 'react';
import api from '../api';

export default function MessageList({ channelId, socket }) {
  const [messages, setMessages] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const topRef = useRef();

  useEffect(() => {
    if (!channelId) return;
    setMessages([]);
    loadRecent();
    // join socket room
    if (socket) socket.emit('joinChannel', channelId);
    const handler = msg => {
      if (msg.channel === channelId) setMessages(prev => [...prev, msg]);
    };
    socket?.on('message:new', handler);
    return () => {
      socket?.off('message:new', handler);
      socket?.emit('leaveChannel', channelId);
    };
  }, [channelId]);

  const loadRecent = async () => {
    const res = await api.get(`/messages/channel/${channelId}?limit=20`);
    setMessages(res.data);
    // scroll to bottom (not shown here)
  };

  const loadOlder = async () => {
    if (messages.length === 0) return;
    setLoadingOlder(true);
    const before = messages[0].createdAt;
    const res = await api.get(`/messages/channel/${channelId}?limit=20&before=${encodeURIComponent(before)}`);
    setMessages(prev => [...res.data, ...prev]);
    setLoadingOlder(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 text-center">
        <button onClick={loadOlder} className="text-sm text-blue-600">{loadingOlder ? 'Loading...' : 'Load older messages'}</button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m._id} className="p-2">
            <div className="text-xs text-gray-500">{m.sender.displayName || m.sender.username} • {new Date(m.createdAt).toLocaleString()}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
