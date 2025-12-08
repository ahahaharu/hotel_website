import React, { Component } from 'react';
import api from '../../api/axiosConfig'; // Импортируем наш настроенный axios
import './Reception.css'; // Предполагаем, что стили там

class RoomAllocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [], // Список загруженных комнат
      loading: true,

      // Данные формы (соответствуют модели Client)
      selectedRoomId: '',
      firstName: '',
      lastName: '',
      middleName: '',
      passportData: '',
      contactInfo: '',
      checkOutDate: '', // Нужно знать, до какого числа заселяем

      isCheckedIn: false,
      currentBookingId: null, // Чтобы знать ID созданной брони
    };
  }

  // 1. Загружаем комнаты при монтировании компонента
  async componentDidMount() {
    try {
      // Загружаем только свободные или все номера (зависит от логики, берем все)
      const response = await api.get('/rooms');
      this.setState({ rooms: response.data, loading: false });
    } catch (error) {
      console.error('Ошибка загрузки номеров:', error);
      alert('Не удалось загрузить список номеров');
      this.setState({ loading: false });
    }
  }

  // Универсальный обработчик ввода
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // 2. Основная логика заселения (Создание брони и клиента)
  handleCheckIn = async () => {
    const {
      selectedRoomId,
      firstName,
      lastName,
      middleName,
      passportData,
      contactInfo,
      checkOutDate,
    } = this.state;

    // Простая валидация
    if (
      !selectedRoomId ||
      !firstName ||
      !lastName ||
      !passportData ||
      !checkOutDate
    ) {
      alert('Пожалуйста, заполните все обязательные поля!');
      return;
    }

    try {
      // Формируем данные для отправки на сервер
      // Используем тот самый эндпоинт POST /api/bookings, который мы делали ранее.
      // Он умеет сам создавать клиента, если передать guestData.
      const bookingData = {
        roomId: selectedRoomId,
        checkInDate: new Date(), // Заселяем "сейчас"
        checkOutDate: checkOutDate,
        guestData: {
          firstName,
          lastName,
          middleName,
          passportData,
          contactInfo,
        },
      };

      const response = await api.post('/bookings', bookingData);

      // Успех
      this.setState({
        isCheckedIn: true,
        currentBookingId: response.data._id,
      });

      // Вызываем пропс родителя, чтобы обновить логи
      this.props.onCheckIn(`${lastName} ${firstName}`);
      alert('Гость успешно заселен!');
    } catch (error) {
      console.error('Ошибка заселения:', error);
      const errorMsg = error.response?.data?.msg || error.message;
      alert(`Ошибка: ${errorMsg}`);
    }
  };

  // Выселение (просто сброс формы или запрос на сервер для смены статуса)
  handleCheckOut = () => {
    // Если нужно, можно отправить запрос на сервер для обновления статуса брони на 'Выехал'
    // await api.put(`/bookings/${this.state.currentBookingId}/status`, { status: 'Выехал' });

    this.setState({
      isCheckedIn: false,
      selectedRoomId: '',
      firstName: '',
      lastName: '',
      middleName: '',
      passportData: '',
      contactInfo: '',
      checkOutDate: '',
      currentBookingId: null,
    });
    this.props.onCheckOut();
  };

  render() {
    const {
      rooms,
      loading,
      isCheckedIn,
      selectedRoomId,
      firstName,
      lastName,
      middleName,
      passportData,
      contactInfo,
      checkOutDate,
    } = this.state;

    // Находим номер комнаты для отображения при успехе
    const roomNumberDisplay =
      rooms.find((r) => r._id === selectedRoomId)?.roomNumber || '';

    return (
      <div className="reception-card">
        <h3>🔑 Распределение номеров (Walk-in)</h3>

        {loading ? (
          <p>Загрузка списка комнат...</p>
        ) : !isCheckedIn ? (
          <div className="allocation-form">
            {/* Группа полей: Данные клиента */}
            <h4
              style={{
                fontSize: '0.9rem',
                margin: '10px 0',
                color: '#666',
                borderBottom: '1px solid #eee',
              }}
            >
              Данные гостя
            </h4>

            <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Фамилия *</label>
                <input
                  name="lastName"
                  value={lastName}
                  onChange={this.handleInputChange}
                  placeholder="Иванов"
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Имя *</label>
                <input
                  name="firstName"
                  value={firstName}
                  onChange={this.handleInputChange}
                  placeholder="Иван"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Отчество</label>
              <input
                name="middleName"
                value={middleName}
                onChange={this.handleInputChange}
                placeholder="Иванович"
              />
            </div>

            <div className="form-group">
              <label>Паспортные данные *</label>
              <input
                name="passportData"
                value={passportData}
                onChange={this.handleInputChange}
                placeholder="Серия и номер"
              />
            </div>

            <div className="form-group">
              <label>Телефон / Контакты *</label>
              <input
                name="contactInfo"
                value={contactInfo}
                onChange={this.handleInputChange}
                placeholder="+7..."
              />
            </div>

            {/* Группа полей: Заселение */}
            <h4
              style={{
                fontSize: '0.9rem',
                margin: '15px 0 10px',
                color: '#666',
                borderBottom: '1px solid #eee',
              }}
            >
              Детали размещения
            </h4>

            <div className="form-group">
              <label>Выберите номер *</label>
              <select
                name="selectedRoomId"
                value={selectedRoomId}
                onChange={this.handleInputChange}
              >
                <option value="">-- Список номеров --</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    № {room.roomNumber} — {room.comfortLevel} ({room.price}₽)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Дата выезда *</label>
              <input
                type="date"
                name="checkOutDate"
                value={checkOutDate}
                onChange={this.handleInputChange}
              />
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={this.handleCheckIn}
            >
              Заселить гостя
            </button>
          </div>
        ) : (
          <div className="checked-in-state">
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
            <p>
              Гость{' '}
              <strong>
                {lastName} {firstName}
              </strong>{' '}
              успешно заселен!
            </p>
            <p>
              Комната: <strong>№ {roomNumberDisplay}</strong>
            </p>
            <button className="btn btn-danger" onClick={this.handleCheckOut}>
              Завершить обслуживание (Очистить)
            </button>
          </div>
        )}
      </div>
    );
  }
}

RoomAllocation.defaultProps = {
  onCheckIn: () => {},
  onCheckOut: () => {},
};

export default RoomAllocation;
