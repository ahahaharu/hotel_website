import React, { useState, useEffect, useContext } from 'react'; // Добавил useContext
import api from '../api/axiosConfig';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal'; // Добавил импорт модального окна
import { AuthContext } from '../context/AuthContext'; // Добавил импорт контекста
import './Home.css';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Получаем пользователя для проверки прав (чтобы показать кнопку Добавить)
  const { user } = useContext(AuthContext);

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

  // --- ВОТ ЭТА ФУНКЦИЯ БЫЛА ПРОПУЩЕНА ---
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот номер?')) return;

    try {
      await api.delete(`/rooms/${id}`);
      // Удаляем из стейта, чтобы исчезло сразу без перезагрузки страницы
      setRooms(rooms.filter((room) => room._id !== id));
    } catch (error) {
      alert(
        'Ошибка при удалении: ' + (error.response?.data?.msg || error.message)
      );
    }
  };
  // ---------------------------------------

  const handleBook = (room) => {
    // Проверка на наличие токена (авторизацию)
    if (!localStorage.getItem('token')) {
      alert('Пожалуйста, войдите в систему для бронирования');
      return;
    }
    setSelectedRoom(room);
  };

  return (
    <div className="home-page container">
      <header className="hero-section">
        <h1>Наши номера</h1>
        <p>Выберите идеальный номер для вашего отдыха</p>

        {/* Кнопка добавления только для админа */}
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
            <RoomCard
              key={room._id}
              room={room}
              onBook={() => handleBook(room)}
              onDelete={handleDelete} // Теперь функция существует
            />
          ))}
        </div>
      )}

      {/* Модальное окно */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default Home;
