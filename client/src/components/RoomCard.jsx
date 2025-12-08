import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Импорт Link
import { AuthContext } from '../context/AuthContext';
import './RoomCard.css';

const RoomCard = ({ room, onBook, onDelete }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="room-card">
      <img
        src={room.photoUrl}
        alt={`Room ${room.roomNumber}`}
        className="room-image"
      />
      <div className="room-info">
        <h3>Комната {room.roomNumber}</h3>
        <p className="room-type">{room.comfortLevel}</p>
        <p className="room-price">{room.price} ₽ / ночь</p>
        <p className="room-capacity">👥 {room.capacity} чел.</p>

        <div className="room-actions">
          {/* Ссылка на детальную страницу */}
          <Link
            to={`/rooms/${room._id}`}
            className="btn btn-secondary"
            style={{
              marginRight: '5px',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            Подробнее
          </Link>

          <button onClick={onBook} className="btn btn-primary">
            Забронировать
          </button>

          {user && user.role === 'admin' && (
            <>
              <Link
                to={`/edit-room/${room._id}`}
                className="btn btn-warning"
                style={{ marginLeft: '5px' }}
              >
                ✏️
              </Link>
              <button
                onClick={() => onDelete(room._id)}
                className="btn btn-danger"
                style={{ marginLeft: '5px' }}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
