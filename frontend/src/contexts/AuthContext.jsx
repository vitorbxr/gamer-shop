// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const token = localStorage.getItem('@GamerShop:token');
   const savedUser = localStorage.getItem('@GamerShop:user');

   if (token && savedUser) {
     setUser(JSON.parse(savedUser));
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   }

   setLoading(false);
 }, []);

 const register = async (name, email, password) => {
   try {
     const userData = {
       id: Date.now(),
       name,
       email,
       role: email === 'admin@test.com' ? 'ADMIN' : 'USER'
     };

     const token = 'fake-jwt-token';
     localStorage.setItem('@GamerShop:token', token);
     localStorage.setItem('@GamerShop:user', JSON.stringify(userData));
     setUser(userData);
     
     return { success: true };
   } catch (error) {
     return {
       success: false,
       error: error.response?.data?.message || 'Erro ao criar conta'
     };
   }
 };

 const login = async (email, password) => {
   console.log('Tentando login com:', email, password);
   
   try {
     if (email === 'admin@test.com' && password === 'admin123') {
       const userData = {
         id: 1,
         name: 'Administrador',
         email,
         role: 'ADMIN'
       };
       
       const token = 'fake-jwt-token';
       localStorage.setItem('@GamerShop:token', token);
       localStorage.setItem('@GamerShop:user', JSON.stringify(userData));
       setUser(userData);
       
       return { success: true };
     }
     
     return {
       success: false,
       error: 'Email ou senha incorretos'
     };
   } catch (error) {
     return {
       success: false,
       error: error.message || 'Erro ao fazer login'
     };
   }
 };

 const logout = () => {
   localStorage.removeItem('@GamerShop:token');
   localStorage.removeItem('@GamerShop:user');
   delete axios.defaults.headers.common['Authorization'];
   setUser(null);
 };

 if (loading) {
   return null;
 }

 return (
   <AuthContext.Provider value={{ user, login, register, logout }}>
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