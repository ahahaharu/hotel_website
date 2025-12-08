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

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          Grand Hotel ⭐️⭐️⭐️⭐️⭐️
        </Link>
        <div className="nav-links">
          <Link to="/">Номера</Link>

          {user ? (
            <>
              <span className="user-badge">
                👤 {user.role === 'admin' ? 'Администратор' : 'Менеджер'}
              </span>
              <button onClick={handleLogout} className="btn-link">
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
