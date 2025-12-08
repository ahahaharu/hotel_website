import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import RoomCard from '../components/RoomCard';
import './Home.css';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchRooms = async () => {
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

  const handleBook = (id) => {
    alert(`Переход к бронированию номера ID: ${id}. (Требуется авторизация)`);
  };

  return (
    <div className="home-page container">
      <header className="hero-section">
        <h1>Наши номера</h1>
        <p>Выберите идеальный номер для вашего отдыха</p>

        {/* Панель фильтрации */}
        <div className="filter-panel">
          <label>Категория: </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">Все номера</option>
            <option value="Обычный">Обычный</option>
            <option value="Полулюкс">Полулюкс</option>
            <option value="Люкс">Люкс</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="loading">Загрузка номеров...</div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} onBook={handleBook} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
