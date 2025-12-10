import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Login.css';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');

  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: 1,
    comfortLevel: 'Обычный',
    price: '',
    description: '',
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        setFormData({
          roomNumber: response.data.roomNumber,
          capacity: response.data.capacity,
          comfortLevel: response.data.comfortLevel,
          price: response.data.price,
          description: response.data.description,
        });
        setCurrentPhotoUrl(response.data.photoUrl);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('roomNumber', formData.roomNumber);
    data.append('capacity', formData.capacity);
    data.append('comfortLevel', formData.comfortLevel);
    data.append('price', formData.price);
    data.append('description', formData.description);

    if (image) {
      data.append('image', image);
    }

    try {
      await api.put(`/rooms/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Номер успешно обновлен!');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert(
        'Ошибка при сохранении: ' + (error.response?.data?.msg || error.message)
      );
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div
        className="login-card"
        style={{ margin: '0 auto', maxWidth: '500px' }}
      >
        <h2>Редактирование номера</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Номер комнаты</label>
            <input
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Вместимость (чел)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Комфортность</label>
            <select
              name="comfortLevel"
              value={formData.comfortLevel}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              <option value="Обычный">Обычный</option>
              <option value="Полулюкс">Полулюкс</option>
              <option value="Люкс">Люкс</option>
            </select>
          </div>

          <div className="form-group">
            <label>Цена (BYN)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />
          </div>
          <div className="form-group">
            <label>Текущее фото</label>
            {currentPhotoUrl && (
              <img
                src={currentPhotoUrl}
                alt="Room"
                style={{
                  width: '100px',
                  display: 'block',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
              />
            )}
            <label>Загрузить новое (необязательно)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Сохранить изменения
          </button>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate('/')}
            style={{ marginTop: '10px', display: 'block', width: '100%' }}
          >
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;
