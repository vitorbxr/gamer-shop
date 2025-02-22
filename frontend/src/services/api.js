// src/services/api.js
import axios from 'axios';
import { authService } from './authService';
import { API_URL } from '../config/api.config';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
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
  
  // Remover barras duplas no URL, exceto após o protocolo
  if (config.url) {
    config.url = config.url.replace(/([^:]\/)\/+/g, "$1");
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

    // Tratamento específico para erros
    if (error.response) {
      // O servidor respondeu com um status de erro
      switch (error.response.status) {
        case 401:
        case 403:
          console.warn('API Interceptor - Erro de autenticação, redirecionando para login');
          authService.logout();
          window.location.href = '/login';
          break;
        case 404:
          console.error('API Interceptor - Recurso não encontrado');
          break;
        case 422:
          console.error('API Interceptor - Erro de validação');
          break;
        case 500:
          console.error('API Interceptor - Erro interno do servidor');
          break;
        default:
          console.error('API Interceptor - Erro não tratado:', error.response.status);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('API Interceptor - Sem resposta do servidor');
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('API Interceptor - Erro de configuração:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;