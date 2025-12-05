import React, { useState } from 'react';
import api from '../../api';

export default function Login({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      onAuth(res.data.token, res.data.user);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <input className="w-full p-2 border mb-2" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input type="password" className="w-full p-2 border mb-2" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full bg-blue-600 text-white p-2">Login</button>
    </form>
  );
}
