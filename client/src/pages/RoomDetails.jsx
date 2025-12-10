import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        setRoom(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="container">Загрузка...</div>;
  if (!room) return <div className="container">Номер не найден</div>;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link"
        style={{ marginBottom: '20px' }}
      >
        ← Назад в каталог
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <img
            src={room.photoUrl}
            alt={`Room ${room.roomNumber}`}
            style={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>Номер {room.roomNumber}</h2>
          <span
            className="badge"
            style={{
              background: '#3498db',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '4px',
            }}
          >
            {room.comfortLevel}
          </span>

          <h3 style={{ marginTop: '20px', color: '#27ae60' }}>
            {room.price} BYN / ночь
          </h3>

          <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#555' }}>
            {room.description || 'Описание отсутствует.'}
          </p>

          <div style={{ marginTop: '20px' }}>
            <strong>Вместимость:</strong> {room.capacity} чел.
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ marginTop: '30px' }}
            onClick={() =>
              alert(
                'Для бронирования вернитесь в каталог и нажмите "Забронировать" (или реализуем логику тут)'
              )
            }
          >
            Забронировать сейчас
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
