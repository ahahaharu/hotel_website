import React from 'react';

const Contacts = () => {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1>Контакты</h1>
      <p>Мы всегда рады видеть вас в нашем отеле!</p>

      <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
        <div style={{ flex: 1 }}>
          <h3>Наш адрес:</h3>
          <p>г. Минск, ул. Примерная, д. 10</p>

          <h3>Телефон:</h3>
          <p>+375 (29) 123-45-67</p>

          <h3>Email:</h3>
          <p>info@grandhotel.by</p>
        </div>

        <div
          style={{
            flex: 1,
            background: '#eee',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: '#888' }}>Карта проезда</p>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
