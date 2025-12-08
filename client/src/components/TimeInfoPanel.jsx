import React, { useState, useEffect } from 'react';
import { getUserTimezone, formatDate } from '../utils/dateFormatter';

const TimeInfoPanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const userTimezone = getUserTimezone();

  useEffect(() => {
    // Обновляем часы каждую секунду
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.block}>
        <small style={styles.label}>Ваша зона ({userTimezone}):</small>
        <div style={styles.time}>{formatDate(currentTime)}</div>
      </div>

      <div style={styles.separator}>|</div>

      <div style={styles.block}>
        <small style={styles.label}>Серверное время (UTC):</small>
        <div style={styles.time}>{formatDate(currentTime, 'UTC')}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: '#f8f9fa',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    marginBottom: '20px',
    fontSize: '0.9rem',
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#6c757d',
    fontSize: '0.75rem',
    marginBottom: '2px',
  },
  time: {
    fontWeight: 'bold',
    color: '#343a40',
  },
  separator: {
    color: '#dee2e6',
    fontSize: '1.5rem',
    fontWeight: '300',
  },
};

export default TimeInfoPanel;
