import React from 'react';
import { Link } from 'react-router-dom';
import './HomeStyles.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="hero-banner">
        <div className="hero-overlay">
          <h1>Grand Hotel</h1>
          <p>Искусство гостеприимства в каждой детали</p>
          <div className="hero-buttons">
            <Link to="/catalog" className="btn btn-primary btn-lg">
              Смотреть номера
            </Link>
            <Link
              to="/contacts"
              className="btn btn-outline-light btn-lg"
              style={{ marginLeft: '10px' }}
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>

      <div className="container section">
        <h2>Почему гости выбирают нас</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span style={{ fontSize: '3rem' }}>🛏️</span>
            <h3>Комфорт</h3>
            <p>Ортопедические матрасы и звукоизоляция.</p>
          </div>
          <div className="feature-item">
            <span style={{ fontSize: '3rem' }}>💬</span>
            <h3>Отзывы</h3>
            <p>
              Мы ценим мнение каждого. <Link to="/reviews">Читать отзывы</Link>
            </p>
          </div>
          <div className="feature-item">
            <span style={{ fontSize: '3rem' }}>📍</span>
            <h3>Локация</h3>
            <p>Самый центр города, парковка включена.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
