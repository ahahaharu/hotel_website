import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // <--- Импорт контекста
import './RoomCard.css';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room, onBook, onDelete }) => {
  // <--- Добавили onDelete
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getBadgeColor = (level) => {
    switch (level) {
      case 'Люкс':
        return '#D4AF37';
      case 'Полулюкс':
        return '#A0A0A0';
      default:
        return '#8B4513';
    }
  };

  return (
    <div className="room-card">
      <div className="card-image">
        <img src={room.photoUrl} alt={`Номер ${room.roomNumber}`} />
        <span
          className="comfort-badge"
          style={{ backgroundColor: getBadgeColor(room.comfortLevel) }}
        >
          {room.comfortLevel}
        </span>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>Номер {room.roomNumber}</h3>

          {user && user.role === 'admin' && (
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                className="btn-icon edit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-room/${room._id}`);
                }}
                title="Редактировать"
              >
                ✎
              </button>

              <button
                className="btn-icon delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(room._id);
                }}
                title="Удалить"
              >
                ✖
              </button>
            </div>
          )}
        </div>

        <p className="description">{room.description}</p>

        <div className="card-details">
          <span>👥 {room.capacity} чел.</span>
          <span className="price">{room.price} ₽ / ночь</span>
        </div>

        <button className="btn btn-primary" onClick={onBook}>
          Забронировать
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
