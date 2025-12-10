import React, { useState } from 'react';
import AdminBookingsTable from '../components/admin/AdminBookingsTable';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="admin-container container">
      <h2 className="admin-title">Панель Администратора</h2>

      <div className="admin-tabs">
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Бронирования
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'bookings' && <AdminBookingsTable />}
        {activeTab === 'users' && <AdminUsersTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;
