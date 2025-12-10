export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDate = (isoDate, timeZone = undefined) => {
  if (!isoDate) return '-';

  const date = new Date(isoDate);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timeZone,
  };

  return new Intl.DateTimeFormat('ru-RU', options).format(date);
};
