// src/contexts/WishlistContext.jsx (correção)
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext({});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  // Remova useToast daqui para evitar duplicação
  // const toast = useToast();

  // Carregar wishlist ao montar o componente
  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated]);

  // Função para carregar a wishlist
  const loadWishlist = async () => {
    if (isAuthenticated && user) {
      // Se estiver logado, busca do servidor
      try {
        setIsLoading(true);
        const response = await api.get('/user/wishlist');
        setWishlist(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar wishlist do servidor:', error);
        // Fallback para wishlist local
        const savedWishlist = localStorage.getItem('@GamerShop:wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Se não estiver logado, usa local storage
      const savedWishlist = localStorage.getItem('@GamerShop:wishlist');
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Erro ao carregar wishlist do localStorage:', error);
          setWishlist([]);
        }
      }
    }
  };

  // Salvar wishlist quando mudar
  useEffect(() => {
    localStorage.setItem('@GamerShop:wishlist', JSON.stringify(wishlist));
    
    // Sincronizar com servidor se estiver logado
    if (isAuthenticated && user) {
      syncWishlistWithServer();
    }
  }, [wishlist, isAuthenticated]);

  // Sincronizar com o servidor
  const syncWishlistWithServer = async () => {
    try {
      await api.post('/user/wishlist/sync', { items: wishlist.map(item => item.id) });
    } catch (error) {
      console.error('Erro ao sincronizar wishlist com o servidor:', error);
    }
  };

  const addToWishlist = (product) => {
    if (!wishlist.some(item => item.id === product.id)) {
      setWishlist(prev => [...prev, product]);
      // Remova o toast daqui
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    // Remova o toast daqui também
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}