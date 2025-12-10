import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка (без изменений)
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  // --- НОВАЯ ФУНКЦИЯ ОТМЕНЫ ---
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Вы действительно хотите отменить это бронирование?')) {
      return;
    }

    try {
      // Вызываем наш новый эндпоинт
      const res = await api.patch(`/bookings/${bookingId}/cancel`);

      // Обновляем состояние локально, чтобы не перезагружать страницу
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, status: 'Отменено' } : b
        )
      );

      alert('Бронирование отменено');
    } catch (error) {
      console.error(error);
      alert(
        'Ошибка при отмене: ' + (error.response?.data?.msg || error.message)
      );
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

  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    return new Date(isoDate).toLocaleDateString('ru-RU');
  };

  if (loading)
    return (
      <div className="container" style={{ padding: '40px' }}>
        Загрузка...
      </div>
    );

  return (
    <div className="container my-bookings-page">
      <h2>Мои бронирования</h2>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет активных бронирований.</p>
          <Link to="/catalog" className="btn btn-primary">
            Выбрать номер
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>Бронь #{booking._id.slice(-6).toUpperCase()}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {booking.status}
                </span>
              </div>

              <div className="booking-body">
                <div className="booking-info">
                  <p>
                    <strong>Номер:</strong> {booking.room?.roomNumber}
                  </p>
                  <p>
                    <strong>Заезд:</strong> {formatDate(booking.checkInDate)}
                  </p>
                  <p>
                    <strong>Выезд:</strong> {formatDate(booking.checkOutDate)}
                  </p>
                </div>

                <div className="booking-actions-right">
                  <div className="booking-price">
                    <span>Итого:</span>
                    <strong>{booking.totalPrice} BYN</strong>
                  </div>

                  {/* КНОПКА ОТМЕНЫ (Показываем только если статус "Забронировано") */}
                  {booking.status === 'Забронировано' && (
                    <button
                      className="btn btn-cancel-outline"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Отменить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
