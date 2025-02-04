// src/contexts/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const WishlistContext = createContext({});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const savedWishlist = localStorage.getItem('@GamerShop:wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('@GamerShop:wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!wishlist.some(item => item.id === product.id)) {
      setWishlist(prev => [...prev, product]);
      toast({
        title: "Produto adicionado aos favoritos",
        status: "success",
        duration: 2000,
      });
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Produto removido dos favoritos",
      status: "info",
      duration: 2000,
    });
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
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}