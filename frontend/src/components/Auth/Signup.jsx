import React, { useState } from 'react';
import api from '../../api';

export default function Signup({ onAuth }) {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [displayName,setDisplayName]=useState('');
  const [err,setErr]=useState('');

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await api.post('/auth/signup', { username, password, displayName });
      onAuth(res.data.token, res.data.user);
    }catch(e){ setErr(e?.response?.data?.message || 'Signup failed'); }
  };

  return (
    <form onSubmit={submit} className="mt-4">
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <input placeholder="username" className="w-full p-2 border mb-2" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="display name (optional)" className="w-full p-2 border mb-2" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
      <input type="password" placeholder="password" className="w-full p-2 border mb-2" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full bg-green-600 text-white p-2">Sign up</button>
    </form>
  );
}
