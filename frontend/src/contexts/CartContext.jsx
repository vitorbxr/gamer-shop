// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { formatPrice } from '../utils/format.js';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const toast = useToast();

  // Carrega o carrinho do localStorage quando o componente monta
  useEffect(() => {
    const savedCart = localStorage.getItem('@GamerShop:cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Salva o carrinho no localStorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem('@GamerShop:cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Se o produto já existe, atualiza a quantidade
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Se não existe, adiciona novo item
      return [...currentItems, { ...product, quantity }];
    });

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== productId));
    
    toast({
      title: "Produto removido",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}