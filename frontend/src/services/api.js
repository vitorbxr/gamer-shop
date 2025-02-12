// src/services/api.js
import axios from 'axios';
import { authService } from './authService';
import { API_URL } from '../config/api.config';

const api = axios.create({
  baseURL: `${API_URL}/api`
});


// Interceptor para adicionar o token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('@GamerShop:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Remove os dados da sessão
      authService.logout();
      
      // Redireciona para o login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;