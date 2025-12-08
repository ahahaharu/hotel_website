import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          🏨 Grand Hotel
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-item">
            Номера
          </Link>

          {user && user.role === 'admin' && (
            <Link to="/add-room" className="nav-item">
              + Добавить номер
            </Link>
          )}

          {user ? (
            <div className="user-controls">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginRight: '10px',
                  gap: '5px',
                }}
              >
                <span style={{ fontWeight: 'bold', color: '#333' }}>
                  {user.username}
                </span>
                <span
                  className={`user-badge role-${user.role}`}
                  style={{ fontSize: '0.75rem', marginTop: '2px' }}
                >
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
