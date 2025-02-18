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
  
  console.log('API Interceptor - URL:', config.url);
  console.log('API Interceptor - Método:', config.method.toUpperCase());
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Interceptor - Token encontrado e adicionado ao header');
  } else {
    console.warn('API Interceptor - Token não encontrado');
  }
  
  if (config.data) {
    console.log('API Interceptor - Dados sendo enviados:', config.data);
  }
  
  return config;
}, (error) => {
  console.error('API Interceptor - Erro na requisição:', error);
  return Promise.reject(error);
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log(`API Interceptor - Resposta ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Interceptor - Erro na resposta:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('API Interceptor - Erro de autenticação, redirecionando para login');
      // Remove os dados da sessão
      authService.logout();
      
      // Redireciona para o login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;