// src/services/api.js
import axios from 'axios';

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@GamerShop:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para tratar respostas e erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa o token se receber unauthorized
      localStorage.removeItem('@GamerShop:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;