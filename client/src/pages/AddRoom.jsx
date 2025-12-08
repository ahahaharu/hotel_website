import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Login.css';

const AddRoom = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: 1,
    comfortLevel: 'Обычный',
    price: '',
    description: '',
  });

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
      await api.post('/rooms', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Номер успешно создан!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Ошибка: ' + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div
        className="login-card"
        style={{ margin: '0 auto', maxWidth: '500px' }}
      >
        <h2>Добавить новый номер</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Номер комнаты</label>
            <input name="roomNumber" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Вместимость</label>
            <input
              type="number"
              name="capacity"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Комфортность</label>
            <select
              name="comfortLevel"
              onChange={handleChange}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="Обычный">Обычный</option>
              <option value="Полулюкс">Полулюкс</option>
              <option value="Люкс">Люкс</option>
            </select>
          </div>
          <div className="form-group">
            <label>Цена (₽)</label>
            <input
              type="number"
              name="price"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Фотография номера</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: '5px' }}
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              onChange={handleChange}
              rows="4"
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Создать
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
