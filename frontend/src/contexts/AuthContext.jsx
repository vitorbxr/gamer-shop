// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@GamerShop:token');
    const savedUser = localStorage.getItem('@GamerShop:user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      
      localStorage.setItem('@GamerShop:token', response.token);
      localStorage.setItem('@GamerShop:user', JSON.stringify(response.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar conta'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      localStorage.setItem('@GamerShop:token', response.token);
      localStorage.setItem('@GamerShop:user', JSON.stringify(response.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Email ou senha incorretos'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('@GamerShop:token');
    localStorage.removeItem('@GamerShop:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('@GamerShop:token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
          return false;
        }
        return true;
      } catch {
        logout();
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 60000); // Checa a cada minuto
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
      checkTokenExpiration 
    }}>
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