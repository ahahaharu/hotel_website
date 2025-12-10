import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import { AuthContext } from '../context/AuthContext';
import './Catalog.css';

const Catalog = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('default');

  const [selectedRoom, setSelectedRoom] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const query = filter !== 'All' ? `?comfort=${filter}` : '';
        const response = await api.get(`/rooms${query}`);
        setRooms(response.data);
      } catch (error) {
        console.error('Ошибка загрузки номеров:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот номер?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(rooms.filter((room) => room._id !== id));
    } catch (error) {
      alert(
        'Ошибка при удалении: ' + (error.response?.data?.msg || error.message)
      );
    }
  };

  const handleBook = (room) => {
    if (!localStorage.getItem('token')) {
      alert('Пожалуйста, войдите в систему для бронирования');
      return;
    }
    setSelectedRoom(room);
  };

  const getDisplayedRooms = () => {
    let result = [...rooms];

    if (searchTerm) {
      result = result.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortType === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortType === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  };

  const displayedRooms = getDisplayedRooms();

  return (
    <div className="home-page container">
      <header className="hero-section">
        <h1>Наши номера</h1>
        <p>Выберите идеальный номер для вашего отдыха</p>

        {user && user.role === 'admin' && (
          <button
            className="btn btn-primary"
            style={{
              marginTop: '10px',
              marginBottom: '20px',
              background: '#27ae60',
            }}
            onClick={() => (window.location.href = '/add-room')}
          >
            + Добавить номер
          </button>
        )}

        <div
          className="filter-panel"
          style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 Найти номер..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">Все категории</option>
              <option value="Обычный">Обычный</option>
              <option value="Полулюкс">Полулюкс</option>
              <option value="Люкс">Люкс</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="filter-select"
            >
              <option value="default">По умолчанию</option>
              <option value="priceAsc">Цена: по возрастанию ⬆️</option>
              <option value="priceDesc">Цена: по убыванию ⬇️</option>
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading">Загрузка номеров...</div>
      ) : (
        <div className="rooms-grid">
          {displayedRooms.length > 0 ? (
            displayedRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onBook={() => handleBook(room)}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div style={{ width: '100%', textAlign: 'center', color: '#666' }}>
              Номера не найдены
            </div>
          )}
        </div>
      )}

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default Catalog;
