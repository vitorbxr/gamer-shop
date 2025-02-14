// src/utils/format.js

const CURRENCY_CONFIG = {
  locale: 'pt-PT',
  currency: 'EUR'
};

const formatPrice = (value) => {
  return value.toLocaleString(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
  });
};

// Formato português: 1234-567
const formatPostalCode = (code) => {
  const cleaned = code.replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}`;
};

// Validação de código postal português
const isValidPostalCode = (code) => {
  const regex = /^[1-9]\d{3}-\d{3}$/;
  return regex.test(code);
};

// Formato de data português
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export { 
  formatPrice, 
  CURRENCY_CONFIG, 
  formatPostalCode, 
  isValidPostalCode,
  formatDate 
};