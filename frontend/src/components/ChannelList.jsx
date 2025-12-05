import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ChannelList({ socket }) {
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState('');
  const [active, setActive] = useState(null);

  const load = async () => {
    const res = await api.get('/channels');
    setChannels(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name) return;
    await api.post('/channels', { name });
    setName('');
    load();
  };

  const join = async (id) => {
    await api.post(`/channels/${id}/join`);
    if (socket) socket.emit('joinChannel', id);
    setActive(id);
    // let ChatWindow subscribe to active channel via shared mechanism (event or context)
    window.dispatchEvent(new CustomEvent('channel:selected', { detail: id }));
  };

  return (
    <div>
      <div className="p-3">
        <form onSubmit={create} className="flex gap-2">
          <input className="flex-1 p-2 border" value={name} onChange={(e)=>setName(e.target.value)} placeholder="New channel" />
          <button className="px-3 bg-blue-600 text-white">Create</button>
        </form>
      </div>
      <ul>
        {channels.map(c => (
          <li key={c._id} className="p-3 border-b flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={()=>join(c._id)}>
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500">{(c.members?.length || 0)} members</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
