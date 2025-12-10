import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import './BookingModal.css';

const BookingModal = ({ room, onClose }) => {
  const { user } = useContext(AuthContext);

  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error

  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    contactInfo: '',
    passportData: '',
  });

  // Расчет цены и дней
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

  const handleChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleGuestChange = (e) => {
    setGuest({ ...guest, [e.target.name]: e.target.value });
  };

  // --- ШАГ 1: Промис проверки доступности ---
  const checkAvailability = (roomId, start, end) => {
    // Возвращаем промис запроса
    return api.post('/bookings/check', {
      roomId: roomId,
      checkInDate: start,
      checkOutDate: end,
    });
  };
  const sendConfirmation = (bookingId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Бронь #${bookingId.slice(-6).toUpperCase()} подтверждена.`);
      }, 500);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (daysCount <= 0) {
      alert('Дата выезда должна быть позже даты заезда!');
      return;
    }

    setStatus('processing');

    checkAvailability(room._id, dates.checkIn, dates.checkOut)
      .then(() => {
        console.log('1. Номер свободен. Создаем бронь...');

        const bookingPayload = {
          roomId: room._id,
          checkInDate: dates.checkIn,
          checkOutDate: dates.checkOut,
          guestData: guest,
          totalPrice: totalPrice,
        };

        return api.post('/bookings', bookingPayload);
      })
      .then((response) => {
        const newBooking = response.data;
        console.log('2. Бронь создана в БД:', newBooking._id);
        return sendConfirmation(newBooking._id);
      })
      .then((confirmationMessage) => {
        console.log('Финал:', confirmationMessage);
        setStatus('success');
        alert(`Успешно! ${confirmationMessage}`);
        onClose();
      })
      .catch((error) => {
        console.error('Сбой в цепочке:', error);
        setStatus('error');

        const msg = error.response?.data?.msg || error.message;

        if (msg && msg.includes('занят')) {
          alert('❌ Ошибка: На выбранные даты этот номер уже занят!');
        } else {
          alert(`Ошибка бронирования: ${msg}`);
        }
      });
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
              <strong>{room.price} BYN</strong>
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
              <strong>{totalPrice} BYN</strong>
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
              placeholder="+375..."
            />
          </div>

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
            disabled={status === 'processing'}
          >
            {status === 'processing' ? 'Обработка...' : 'Подтвердить бронь'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
