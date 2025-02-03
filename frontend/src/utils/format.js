// src/utils/format.js

const CURRENCY_CONFIG = {
    locale: 'pt-BR',
    currency: 'BRL'
  };
  
  const formatPrice = (value) => {
    return value.toLocaleString(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
    });
  };
  
  export { formatPrice, CURRENCY_CONFIG };