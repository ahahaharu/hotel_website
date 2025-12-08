import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Состояние для часов
  const [currentTime, setCurrentTime] = useState(new Date());

  // Определяем таймзону один раз при загрузке
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    // Тикаем каждую секунду
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'manager':
        return 'Менеджер';
      default:
        return 'Гость';
    }
  };

  // Форматирование времени (HH:mm)
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Форматирование даты (DD.MM.YYYY)
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          🏨 Grand Hotel
        </Link>

        <div className="nav-links">
          <div className="time-widget">
            <div className="time-row">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="current-timezone">{userTimeZone}</span>
            </div>
            <div className="date-row">{formatDate(currentTime)}</div>
          </div>
          <Link to="/" className="nav-item">
            Главная
          </Link>
          <Link to="/catalog" className="nav-item">
            Номера
          </Link>
          <Link to="/reviews" className="nav-item">
            Отзывы
          </Link>
          <Link to="/contacts" className="nav-item">
            Контакты
          </Link>
          {user && user.role === 'admin' && (
            <>
              <Link to="/add-room" className="nav-item">
                + Добавить номер
              </Link>
              <Link
                to="/admin"
                className="nav-item"
                style={{ color: '#d35400' }}
              >
                ⚙️ Админ панель
              </Link>
            </>
          )}
          {user ? (
            <div className="user-controls">
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className={`user-badge role-${user.role}`}>
                  {getRoleName(user.role)}
                </span>
              </div>

              <button onClick={handleLogout} className="btn-logout">
                Выйти
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-item">
                Вход
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
