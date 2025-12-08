export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Форматтер для отображения даты
export const formatDate = (isoDate, timeZone = undefined) => {
  if (!isoDate) return '-';

  const date = new Date(isoDate);

  // Опции форматирования
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timeZone, // Если undefined, браузер использует локальную зону
  };

  return new Intl.DateTimeFormat('ru-RU', options).format(date);
};
