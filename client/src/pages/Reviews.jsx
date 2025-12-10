import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Reviews.css';

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  const [formData, setFormData] = useState({ rating: 5, text: '' });
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendReviewXHR = () => {
    setStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:5000/api/reviews';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const token = localStorage.getItem('token');
    if (token) xhr.setRequestHeader('x-auth-token', token);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        setStatus('success');
        setProgress(100);
        setFormData({ rating: 5, text: '' });
        fetchReviews();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        if (xhr.status === 401) {
          setErrorMessage('Ошибка: Вы не авторизованы.');
        } else {
          setErrorMessage(`Ошибка сервера: ${xhr.status}`);
        }
      }
    };

    xhr.onerror = () => {
      setStatus('error');
      setErrorMessage('Ошибка сети. Проверьте подключение.');
    };

    const payload = JSON.stringify({
      username: user ? user.username : 'Anonymous',
      rating: formData.rating,
      text: formData.text,
    });

    xhr.send(payload);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    sendReviewXHR();
  };

  const handleRetry = () => {
    sendReviewXHR();
  };

  return (
    <div className="container reviews-page">
      <h1>Отзывы наших гостей</h1>

      {user ? (
        <div className="review-form-card">
          <h3>Оставить отзыв</h3>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Вы вошли как: <strong>{user.username}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ваша оценка:</label>
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                className="rating-select"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Комментарий:</label>
              <textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder="Расскажите о ваших впечатлениях..."
                rows="3"
                required
              />
            </div>

            {status === 'uploading' && (
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
                <span>Отправка... {progress}%</span>
              </div>
            )}

            {status === 'success' && (
              <div className="status-msg success">
                ✅ Отзыв успешно отправлен!
              </div>
            )}

            {status === 'error' && (
              <div className="error-container">
                <div className="status-msg error">❌ {errorMessage}</div>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn btn-warning btn-sm"
                >
                  Повторить попытку
                </button>
              </div>
            )}

            {status !== 'uploading' && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'uploading'}
              >
                Отправить отзыв
              </button>
            )}
          </form>
        </div>
      ) : (
        <div
          className="review-form-card"
          style={{ textAlign: 'center', padding: '40px' }}
        >
          <h3>Хотите оставить отзыв?</h3>
          <p style={{ marginBottom: '20px', color: '#555' }}>
            Только зарегистрированные гости могут делиться впечатлениями.
          </p>
          <div
            style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}
          >
            <Link to="/login" className="btn btn-primary">
              Войти
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary"
              style={{
                background: '#6c757d',
                color: 'white',
                padding: '10px 20px',
                textDecoration: 'none',
                borderRadius: '5px',
              }}
            >
              Регистрация
            </Link>
          </div>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map((rev) => (
          <div key={rev._id} className="review-item">
            <div className="review-header">
              <strong>{rev.username}</strong>
              <span className="review-date">
                {new Date(rev.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="review-rating">{'⭐'.repeat(rev.rating)}</div>
            <p className="review-text">{rev.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
