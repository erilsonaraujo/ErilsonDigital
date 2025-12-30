const DEFAULT_TIME_ZONE = 'America/Sao_Paulo';

export const formatDateTime = (value?: string, timeZone = DEFAULT_TIME_ZONE) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-BR', { timeZone, timeZoneName: 'short' });
};

export const formatDate = (value?: string, timeZone = DEFAULT_TIME_ZONE) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR', { timeZone });
};

export const formatTime = (value?: string, timeZone = DEFAULT_TIME_ZONE) => {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('pt-BR', { timeZone });
};
