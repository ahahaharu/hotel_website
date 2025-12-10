import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import DateCell from '../DateCell';

const AdminBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/all');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert('Ошибка обновления статуса');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Забронировано':
        return '#f39c12';
      case 'Заселен':
        return '#27ae60';
      case 'Выехал':
        return '#7f8c8d';
      case 'Отменено':
        return '#c0392b';
      default:
        return '#333';
    }
  };

  if (loading) return <div>Загрузка данных...</div>;

  return (
    <div className="table-responsive">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Комната</th>
            <th>Даты (Заезд / Выезд)</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>
                <div style={{ fontWeight: 'bold' }}>
                  {booking.client?.lastName} {booking.client?.firstName}
                </div>
                <small style={{ color: '#666' }}>
                  {booking.client?.contactInfo}
                </small>
              </td>
              <td>
                <strong>№ {booking.room?.roomNumber}</strong>
              </td>
              <td>
                <small>
                  Заезд: <DateCell isoDate={booking.checkInDate} />
                </small>
                <div style={{ height: '5px' }}></div>
                <small>
                  Выезд: <DateCell isoDate={booking.checkOutDate} />
                </small>
              </td>
              <td>{booking.totalPrice} BYN</td>
              <td>
                <span
                  style={{
                    padding: '5px 10px',
                    borderRadius: '15px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    backgroundColor: getStatusColor(booking.status),
                  }}
                >
                  {booking.status}
                </span>
              </td>
              <td>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  }
                  className="status-select"
                >
                  <option value="Забронировано">Забронировано</option>
                  <option value="Заселен">Заселен</option>
                  <option value="Выехал">Выехал</option>
                  <option value="Отменено">Отменено</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookingsTable;
