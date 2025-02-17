// src/services/orderService.js
import api from './api';

const create = async (orderData) => {
  try {
    // Busca dados do cupom do localStorage
    const appliedCoupon = localStorage.getItem('appliedCoupon');
    
    if (appliedCoupon) {
      const couponData = JSON.parse(appliedCoupon);
      // Adiciona dados do cupom ao orderData
      orderData = {
        ...orderData,
        couponId: couponData.id,
        discountAmount: couponData.discount
      };
    }

    // Cria o pedido
    const response = await api.post('/orders', orderData);

    // Limpa o cupom do localStorage após criar o pedido com sucesso
    if (appliedCoupon) {
      localStorage.removeItem('appliedCoupon');
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAll = async () => {
  const response = await api.get('/orders');
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

const updateStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

const getUserOrders = async () => {
  const response = await api.get('/orders/user');
  return response.data;
};

export const orderService = {
  create,
  getAll,
  getById,
  updateStatus,
  getUserOrders
};