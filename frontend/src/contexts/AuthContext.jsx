// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem('@GamerShop:token');
      const savedUser = sessionStorage.getItem('@GamerShop:user');

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      sessionStorage.removeItem('@GamerShop:token');
      sessionStorage.removeItem('@GamerShop:user');
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      console.log('Iniciando registro:', { name, email });
      const response = await authService.register(name, email, password);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Resposta inválida do servidor');
      }

      sessionStorage.setItem('@GamerShop:token', response.token);
      sessionStorage.setItem('@GamerShop:user', JSON.stringify(response.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      setUser(response.user);
      setError(null);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erro ao criar conta';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Iniciando login:', { email });
      const response = await authService.login(email, password);
      
      if (!response || !response.token || !response.user) {
        console.error('Resposta inválida do servidor:', response);
        throw new Error('Resposta inválida do servidor');
      }

      console.log('Login bem-sucedido:', { user: response.user });
      sessionStorage.setItem('@GamerShop:token', response.token);
      sessionStorage.setItem('@GamerShop:user', JSON.stringify(response.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      setUser(response.user);
      setError(null);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      console.error('Detalhes da resposta:', error.response);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Email ou senha incorretos';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem('@GamerShop:token');
      sessionStorage.removeItem('@GamerShop:user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const checkTokenExpiration = () => {
    try {
      const token = sessionStorage.getItem('@GamerShop:token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          console.log('Token expirado, fazendo logout');
          logout();
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      logout();
    }
    return false;
  };

  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    checkTokenExpiration,
    error,
    clearError: () => setError(null)
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}