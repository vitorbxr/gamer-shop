import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formatPrice } from '../utils/format';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

const cartReducer = (state, action) => {
  console.log('Reducer action:', action.type, action.payload);
  
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

  // Carrega o carrinho do sessionStorage ao montar o componente
  useEffect(() => {
    console.log('Inicializando CartProvider');
    try {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Carrinho encontrado no sessionStorage:', parsedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          parsedCart.items.forEach(item => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      sessionStorage.removeItem('cart');
    }
  }, []);

  // Salva o carrinho no sessionStorage quando houver mudanças
  useEffect(() => {
    console.log('Estado do carrinho alterado:', state);
    try {
      if (state.items.length > 0) {
        sessionStorage.setItem('cart', JSON.stringify(state));
      } else {
        sessionStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, [state]);

  const addToCart = async (product, quantity = 1) => {
    console.log('Adicionando ao carrinho:', product, quantity);
    try {
      const response = await fetch(`/api/products/${product.id}/stock`);
      const { stock } = await response.json();
      
      const currentQuantity = state.items.find(item => item.id === product.id)?.quantity || 0;
      
      if (currentQuantity + quantity > stock) {
        throw new Error(`Apenas ${stock} unidades disponíveis em estoque`);
      }
      
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
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    console.log('Atualizando quantidade:', productId, newQuantity);
    if (newQuantity < 1) {
      dispatch({
        type: 'REMOVE_ITEM',
        payload: { id: productId },
      });
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/stock`);
      const { stock } = await response.json();
      
      if (newQuantity > stock) {
        throw new Error(`Apenas ${stock} unidades disponíveis em estoque`);
      }
      
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity: newQuantity },
      });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  };

  const removeFromCart = (productId) => {
    console.log('Removendo do carrinho:', productId);
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id: productId },
    });
  };

  const clearCart = () => {
    console.log('Limpando carrinho');
    dispatch({ type: 'CLEAR_CART' });
  };

  const verifyStock = async () => {
    console.log('Verificando estoque');
    const stockErrors = [];
    
    for (const item of state.items) {
      try {
        const response = await fetch(`/api/products/${item.id}/stock`);
        const { stock } = await response.json();
        
        if (item.quantity > stock) {
          stockErrors.push({
            productId: item.id,
            name: item.name,
            requested: item.quantity,
            available: stock,
          });
        }
      } catch (error) {
        console.error(`Erro ao verificar estoque do produto ${item.id}:`, error);
        stockErrors.push({
          productId: item.id,
          name: item.name,
          error: 'Erro ao verificar estoque',
        });
      }
    }
    
    return stockErrors;
  };

  const value = {
    items: state.items,
    total: state.total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    verifyStock,
    formatPrice,
    itemCount: state.items.length,
  };

  console.log('CartProvider render com valor:', value);

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