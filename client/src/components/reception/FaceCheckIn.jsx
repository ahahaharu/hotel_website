import React, { useState, useMemo } from 'react';
import './Reception.css'; // Общий CSS создадим позже

// Декларативная функция
function FaceCheckIn({ onFaceScan, defaultStatus = 'Ожидание' }) {
  const [scanStatus, setScanStatus] = useState(defaultStatus);
  const [attempts, setAttempts] = useState(0);

  const statusColor = useMemo(() => {
    switch (scanStatus) {
      case 'Успешно':
        return '#27ae60';
      case 'Ошибка':
        return '#c0392b';
      case 'Сканирование...':
        return '#f39c12';
      default:
        return '#7f8c8d';
    }
  }, [scanStatus]);

  // Обработчик 1: Сканирование лица
  const handleScanClick = () => {
    setScanStatus('Сканирование...');
    setAttempts((prev) => prev + 1);

    // Имитация задержки сканирования
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% успех

      if (isSuccess) {
        setScanStatus('Успешно');
        // Передача параметров в родительский обработчик
        onFaceScan({ success: true, guestName: 'Иван Иванов', confidence: 98 });
      } else {
        setScanStatus('Ошибка');
        onFaceScan({ success: false, error: 'Лицо не распознано' });
      }
    }, 1500);
  };

  return (
    <div className="reception-card">
      <h3>📸 Face ID Check-In</h3>
      <div
        className="face-scanner-box"
        style={{ borderColor: statusColor, color: statusColor }}
      >
        {scanStatus === 'Ожидание' && (
          <span style={{ fontSize: '40px' }}>👤</span>
        )}
        {scanStatus === 'Сканирование...' && <span className="spin">🔄</span>}
        {scanStatus === 'Успешно' && (
          <span style={{ fontSize: '40px' }}>✅</span>
        )}
        {scanStatus === 'Ошибка' && (
          <span style={{ fontSize: '40px' }}>❌</span>
        )}
      </div>

      <p>
        Статус: <strong style={{ color: statusColor }}>{scanStatus}</strong>
      </p>
      <p>
        <small>Попыток: {attempts}</small>
      </p>

      <button className="btn btn-primary" onClick={handleScanClick}>
        Сканировать лицо
      </button>
    </div>
  );
}

export default FaceCheckIn;
