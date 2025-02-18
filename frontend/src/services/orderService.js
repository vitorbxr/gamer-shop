// src/services/orderService.js
import api from './api';

const create = async (orderData) => {
  try {
    // Busca dados do cupom do localStorage
    const appliedCoupon = localStorage.getItem('appliedCoupon');
    
    if (appliedCoupon) {
      const couponData = JSON.parse(appliedCoupon);
      console.log('OrderService - Dados do cupom:', couponData);
      
      // Adiciona dados do cupom ao orderData
      orderData = {
        ...orderData,
        couponId: couponData.id,
        discountAmount: couponData.discount
      };
    }

    console.log('OrderService - Dados finais sendo enviados para API:', orderData);

    // Cria o pedido
    const response = await api.post('/orders', orderData);

    console.log('OrderService - Resposta da API:', response.data);

    // Limpa o cupom do localStorage após criar o pedido com sucesso
    if (appliedCoupon) {
      localStorage.removeItem('appliedCoupon');
    }

    return response.data;
  } catch (error) {
    console.error('OrderService - Erro ao criar pedido:', error.response || error);
    throw error;
  }
};

const getAll = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('OrderService - Erro ao buscar todos os pedidos:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`OrderService - Erro ao buscar pedido ${id}:`, error);
    throw error;
  }
};

const updateStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    console.log('OrderService - Status atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`OrderService - Erro ao atualizar status do pedido ${id}:`, error);
    throw error;
  }
};

const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/user');
    return response.data;
  } catch (error) {
    console.error('OrderService - Erro ao buscar pedidos do usuário:', error);
    throw error;
  }
};

// Novos métodos para tracking
const getTracking = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/tracking`);
    console.log('OrderService - Informações de rastreio obtidas:', response.data);
    return response.data;
  } catch (error) {
    console.error(`OrderService - Erro ao obter informações de rastreio do pedido ${orderId}:`, error);
    throw error;
  }
};

const updateTrackingNumber = async (orderId, trackingNumber) => {
  try {
    const response = await api.post(`/orders/${orderId}/tracking`, { trackingNumber });
    console.log('OrderService - Código de rastreio atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`OrderService - Erro ao atualizar código de rastreio do pedido ${orderId}:`, error);
    throw error;
  }
};

export const orderService = {
  create,
  getAll,
  getById,
  updateStatus,
  getUserOrders,
  getTracking,
  updateTrackingNumber
};