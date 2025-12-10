import React from 'react';
import { formatDate } from '../utils/dateFormatter';

const DateCell = ({ isoDate }) => {
  if (!isoDate) return <span>-</span>;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}
    >
      <span style={{ fontWeight: '500', color: '#2c3e50' }}>
        {formatDate(isoDate)}
      </span>

      <span style={{ fontSize: '0.75rem', color: '#95a5a6' }}>
        UTC: {formatDate(isoDate, 'UTC')}
      </span>
    </div>
  );
};

export default DateCell;
