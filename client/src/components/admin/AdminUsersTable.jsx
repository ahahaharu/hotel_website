import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import DateCell from '../DateCell';

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Email / Логин</th>
          <th>Имя</th>
          <th>Роль</th>
          <th>Провайдер</th>
          <th>Дата регистрации</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.email || user.username}</td>
            <td>{user.username}</td>
            <td>
              <span className={`user-badge role-${user.role}`}>
                {user.role}
              </span>
            </td>
            <td>{user.authProvider === 'google' ? 'Google 🔵' : 'Email ✉️'}</td>
            <td>
              <DateCell isoDate={user.createdAt} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminUsersTable;
