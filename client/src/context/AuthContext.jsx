import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. При загрузке страницы достаем и имя тоже
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username'); // <--- Достаем имя

    if (token) {
      setUser({ role, username }); // <--- Сохраняем в стейт
      api.defaults.headers.common['x-auth-token'] = token;
    }
    setLoading(false);
  }, []);

  // 2. Обновляем функцию LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username); // <--- Сохраняем имя

      setUser({ role: res.data.role, username: res.data.username }); // <--- В стейт
      api.defaults.headers.common['x-auth-token'] = res.data.token;

      return { success: true };
    } catch (err) {
      return { success: false, msg: err.response?.data?.msg || 'Ошибка входа' };
    }
  };

  // 3. Обновляем функцию REGISTER
  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username); // <--- Сохраняем имя

      setUser({ role: res.data.role, username: res.data.username }); // <--- В стейт
      api.defaults.headers.common['x-auth-token'] = res.data.token;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        msg: err.response?.data?.msg || 'Ошибка регистрации',
      };
    }
  };

  // 4. Обновляем функцию GOOGLE LOGIN
  const googleLogin = async (token) => {
    try {
      const res = await api.post('/auth/google', { token });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username); // <--- Сохраняем имя

      setUser({ role: res.data.role, username: res.data.username }); // <--- В стейт
      api.defaults.headers.common['x-auth-token'] = res.data.token;

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, msg: 'Ошибка авторизации через Google' };
    }
  };

  // 5. Обновляем LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username'); // <--- Удаляем имя
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
