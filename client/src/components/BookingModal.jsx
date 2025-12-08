import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './BookingModal.css';

const BookingModal = ({ room, onClose }) => {
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
      });
      alert(`Бронирование успешно! К оплате: ${totalPrice} ₽`);
      onClose();
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Бронирование: {room.roomNumber}</h3>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
              }}
            >
              <span>Цена за сутки:</span>
              <strong>{room.price} ₽</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
              }}
            >
              <span>Количество ночей:</span>
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
              <strong>{totalPrice > 0 ? totalPrice : 0} ₽</strong>
            </div>
          </div>

          <h4>Данные гостя</h4>
          <div className="form-group">
            <label>Имя</label>
            <input
              name="firstName"
              required
              onChange={handleGuestChange}
              placeholder="Иван"
            />
          </div>
          <div className="form-group">
            <label>Фамилия</label>
            <input
              name="lastName"
              required
              onChange={handleGuestChange}
              placeholder="Иванов"
            />
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

          <button type="submit" className="btn btn-primary btn-block">
            Подтвердить бронь
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
