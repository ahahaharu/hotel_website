import React, { createContext, useState } from 'react';
import api from '../api/axiosConfig';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      return { role };
    }
    return null;
  });

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      setUser({ role: res.data.role });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data?.msg);
      return {
        success: false,
        msg: error.response?.data?.msg || 'Ошибка сервера',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
