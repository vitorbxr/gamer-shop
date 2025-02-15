// src/services/orderService.js
import api from './api';

const create = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
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