import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext'; // Импортируем контекст
import './BookingModal.css';

const BookingModal = ({ room, onClose }) => {
  const { user } = useContext(AuthContext); // Получаем текущего юзера

  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [daysCount, setDaysCount] = useState(0);

  // Добавили passportData, так как он обязателен в модели Client
  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    contactInfo: '',
    passportData: '',
  });

  // Эффект для подсчета цены
  useEffect(() => {
    if (dates.checkIn && dates.checkOut) {
      const start = new Date(dates.checkIn);
      const end = new Date(dates.checkOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setDaysCount(diffDays);
        setTotalPrice(diffDays * room.price);
      } else {
        setDaysCount(0);
        setTotalPrice(0);
      }
    }
  }, [dates, room.price]);

  // (Опционально) Эффект для подгрузки данных, если клиент уже бронировал ранее
  // Для этого нужен отдельный эндпоинт типа GET /api/clients/me
  // Пока пропустим для простоты, пользователь введет руками.

  const handleChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleGuestChange = (e) => {
    setGuest({ ...guest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (daysCount <= 0) {
      alert('Дата выезда должна быть позже даты заезда!');
      return;
    }

    try {
      // Отправляем запрос. Токен (x-auth-token) уйдет автоматически через axiosConfig
      await api.post('/bookings', {
        roomId: room._id, // Важно: используем _id для Mongo
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
        guestData: guest, // Передаем объект с данными гостя
        totalPrice: totalPrice, // Можно передать цену, но лучше считать на сервере
      });

      alert(`Бронирование успешно! К оплате: ${totalPrice} ₽`);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Ошибка: ' + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Бронирование: Комната {room.roomNumber}</h3>
          <button onClick={onClose} className="btn-close">
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Даты */}
          <div className="form-row">
            <div className="form-group">
              <label>Дата заезда</label>
              <input
                type="date"
                name="checkIn"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Дата выезда</label>
              <input
                type="date"
                name="checkOut"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Расчет цены */}
          <div
            className="price-calculation"
            style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              margin: '15px 0',
              border: '1px solid #dee2e6',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Цена за сутки:</span>
              <strong>{room.price} ₽</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Ночей:</span>
              <strong>{daysCount > 0 ? daysCount : '-'}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                borderTop: '1px solid #ccc',
                paddingTop: '10px',
                color: '#D4AF37',
                fontSize: '1.2rem',
              }}
            >
              <span>Итого:</span>
              <strong>{totalPrice} ₽</strong>
            </div>
          </div>

          <h4>Данные гостя</h4>

          <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Имя</label>
              <input
                name="firstName"
                required
                onChange={handleGuestChange}
                placeholder="Иван"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Фамилия</label>
              <input
                name="lastName"
                required
                onChange={handleGuestChange}
                placeholder="Иванов"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Телефон</label>
            <input
              name="contactInfo"
              required
              onChange={handleGuestChange}
              placeholder="+7..."
            />
          </div>

          {/* ВАЖНОЕ НОВОЕ ПОЛЕ */}
          <div className="form-group">
            <label>Паспортные данные</label>
            <input
              name="passportData"
              required
              onChange={handleGuestChange}
              placeholder="Серия и номер"
            />
            <small style={{ color: '#666' }}>
              Необходимы для регистрации в отеле
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: '20px' }}
          >
            Подтвердить бронь
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
