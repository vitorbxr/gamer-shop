import api from './api';

export const productService = {
  getAll: async (page = 1, limit = 12) => {
    try {
      const response = await api.get('/products', {
        params: { page, limit }
      });
      // Garantimos que sempre retornamos um array de produtos
      return {
        products: response.data.products || [],
        pagination: response.data.pagination || { total: 0, pages: 1 }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Em caso de erro, retornamos um array vazio
      return { products: [], pagination: { total: 0, pages: 1 } };
    }
  },

  getFeatured: async (limit = 8) => {
    try {
      const response = await api.get('/products/featured', {
        params: { limit }
      });
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return [];
    }
  },

  create: async (productData) => {
    try {
      const response = await api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao criar produto:', error.response?.data || error);
      
      if (error.response?.data?.details) {
        const errorMessage = error.response.data.details
          .map(detail => `${detail.field}: ${detail.message}`)
          .join('; ');
        
        throw new Error(errorMessage || error.response.data.error || 'Erro ao criar produto');
      }
  
      throw new Error(
        error.response?.data?.error || 
        'Erro ao criar produto'
      );
    }
  },

  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar produto');
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error(error.response?.data?.message || 'Erro ao deletar produto');
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  getBrands: async () => {
    try {
      const response = await api.get('/products/brands');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      return [];
    }
  }
};