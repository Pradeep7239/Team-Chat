import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    // keep user in sync if needed
  }, []);

  const save = (token, userObj) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  return { user, save, logout };
}
