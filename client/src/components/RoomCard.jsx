import React from 'react';
import './RoomCard.css';

const RoomCard = ({ room, onBook }) => {
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
        <h3>Номер {room.roomNumber}</h3>
        <p className="description">{room.description}</p>

        <div className="card-details">
          <span>👥 {room.capacity} чел.</span>
          <span className="price">{room.price} ₽ / ночь</span>
        </div>

        <button className="btn btn-primary" onClick={() => onBook(room._id)}>
          Забронировать
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
