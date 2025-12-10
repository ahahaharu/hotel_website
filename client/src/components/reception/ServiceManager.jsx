import React, { useState } from 'react';

const ServiceManager = ({
  onServiceRequest,
  onCleaningSchedule,
  onGuestFeedback,
}) => {
  const [activeService, setActiveService] = useState(null);
  const [feedback, setFeedback] = useState('');

  const services = [
    { id: 1, name: '🍽️ Ужин в номер', price: 1500 },
    { id: 2, name: '🧖 Спа-процедуры', price: 3000 },
    { id: 3, name: '🚕 Такси', price: 500 },
  ];

  const handleServiceOrder = (serviceId, serviceName) => {
    setActiveService(serviceName);
    onServiceRequest(serviceId, serviceName);

    setTimeout(() => setActiveService(null), 2000);
  };

  const handleCleaning = () => {
    const time = new Date().toLocaleTimeString();
    onCleaningSchedule(time);
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      onGuestFeedback(feedback);
      setFeedback('');
    }
  };

  return (
    <div className="reception-card">
      <h3>🛎️ Сервисы и Услуги</h3>

      <div className="services-list">
        <h4>Заказать услугу:</h4>
        <div className="service-buttons">
          {services.map((s) => (
            <button
              key={s.id}
              className={`btn btn-outline ${
                activeService === s.name ? 'active-service' : ''
              }`}
              onClick={() => handleServiceOrder(s.id, s.name)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <hr />

      <div className="cleaning-section">
        <button className="btn btn-info" onClick={handleCleaning}>
          🧹 Вызвать уборку сейчас
        </button>
      </div>

      <hr />

      <form onSubmit={submitFeedback} className="feedback-form">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Быстрый отзыв гостя..."
        />
        <button type="submit" className="btn btn-dark">
          Отправить
        </button>
      </form>
    </div>
  );
};

ServiceManager.defaultProps = {
  onServiceRequest: () => console.log('Service requested'),
};

export default ServiceManager;
