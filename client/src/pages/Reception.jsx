import React, { useState } from 'react';
import FaceCheckIn from '../components/reception/FaceCheckIn';
import RoomAllocation from '../components/reception/RoomAllocation';
import ServiceManager from '../components/reception/ServiceManager';
import '../components/reception/Reception.css';

const Reception = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${message}`, ...prev]);
  };

  const handleFaceScanResult = (result) => {
    if (result.success) {
      addLog(
        `✅ FACE ID: Гость ${result.guestName} опознан (Точность: ${result.confidence}%)`
      );
    } else {
      addLog(`❌ FACE ID: Ошибка - ${result.error}`);
    }
  };

  const handleRoomAssign = (roomNumber, guestName) => {
    addLog(`📝 НАЗНАЧЕНИЕ: Комната ${roomNumber} закреплена за ${guestName}`);
  };

  const handleCheckIn = (guestName) => {
    addLog(`🏃 ЗАЕЗД: Гость ${guestName} получил ключи и заселился.`);
  };

  const handleCheckOut = () => {
    addLog(`🏁 ВЫЕЗД: Гость сдал ключи и выехал.`);
  };

  const handleServiceRequest = (id, name) => {
    addLog(`🛎️ УСЛУГА: Заказано "${name}" (ID: ${id})`);
  };

  const handleCleaningSchedule = (time) => {
    addLog(`🧹 УБОРКА: Запрос на клининг отправлен в ${time}`);
  };

  const handleGuestFeedback = (text) => {
    addLog(`💬 ОТЗЫВ: "${text}"`);
  };

  const availableRooms = [
    { id: 101, number: '101', type: 'Стандарт' },
    { id: 102, number: '102', type: 'Люкс' },
    { id: 205, number: '205', type: 'Президентский' },
  ];

  return (
    <div className="container reception-page">
      <h1 className="text-center mb-4">🖥️ Панель Администратора (Reception)</h1>

      <div className="reception-grid">
        <FaceCheckIn
          onFaceScan={handleFaceScanResult}
          defaultStatus="Ожидание"
        />

        <RoomAllocation
          rooms={availableRooms}
          onRoomAssign={handleRoomAssign}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />

        <ServiceManager
          onServiceRequest={handleServiceRequest}
          onCleaningSchedule={handleCleaningSchedule}
          onGuestFeedback={handleGuestFeedback}
        />
      </div>

      <div className="logs-panel">
        <h4>📜 Журнал операций</h4>
        <div className="logs-list">
          {logs.length === 0 ? (
            <p className="text-muted">Действий пока нет...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="log-item">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reception;
