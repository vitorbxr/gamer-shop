// src/services/productService.js
import api from './api';

export const productService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/products?featured=true');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/products/${id}`);
  }
};