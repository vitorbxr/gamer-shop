// src/services/cacheService.js
const CACHE_KEY = 'gamerShop:products';
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutos

export const cacheService = {
  set: (key, data) => {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  },

  get: (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('gamerShop:'))
      .forEach(key => localStorage.removeItem(key));
  }
};