import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (token) {
      setUser({ role, username });
      api.defaults.headers.common['x-auth-token'] = token;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);

      setUser({ role: res.data.role, username: res.data.username });
      api.defaults.headers.common['x-auth-token'] = res.data.token;

      return { success: true };
    } catch (err) {
      return { success: false, msg: err.response?.data?.msg || 'Ошибка входа' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);

      setUser({ role: res.data.role, username: res.data.username });
      api.defaults.headers.common['x-auth-token'] = res.data.token;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        msg: err.response?.data?.msg || 'Ошибка регистрации',
      };
    }
  };

  const googleLogin = async (token) => {
    try {
      const res = await api.post('/auth/google', { token });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);

      setUser({ role: res.data.role, username: res.data.username });
      api.defaults.headers.common['x-auth-token'] = res.data.token;

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, msg: 'Ошибка авторизации через Google' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
    delete api.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, googleLogin }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
