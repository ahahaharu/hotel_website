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

  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    contactInfo: '',
    passportData: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (daysCount <= 0) {
      alert('Дата выезда должна быть позже даты заезда!');
      return;
    }

    try {
      await api.post('/bookings', {
        roomId: room._id,
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
        guestData: guest,
        totalPrice: totalPrice,
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
