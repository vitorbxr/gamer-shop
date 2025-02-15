// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formatPrice } from '../utils/format';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }
      
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
};

const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Carrega o carrinho do sessionStorage ao montar o componente
  useEffect(() => {
    const savedCart = sessionStorage.getItem('gamer-shop-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach(item => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        sessionStorage.removeItem('gamer-shop-cart');
      }
    }
  }, []);

  // Salva o carrinho no sessionStorage quando houver mudanças
  useEffect(() => {
    if (state.items.length > 0) {
      sessionStorage.setItem('gamer-shop-cart', JSON.stringify(state));
    } else {
      sessionStorage.removeItem('gamer-shop-cart');
    }
  }, [state]);

  const addToCart = async (product, quantity = 1) => {
    // Temporariamente removida a verificação de estoque
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      },
    });
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch({
        type: 'REMOVE_ITEM',
        payload: { id: productId },
      });
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity: newQuantity },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id: productId },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    items: state.items,
    total: state.total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    itemCount: state.items.length,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};