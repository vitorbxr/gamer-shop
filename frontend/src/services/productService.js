import api from './api';

export const productService = {
  getAll: async (page = 1, limit = 12, filters = {}) => {
    try {
      console.log("=== INÍCIO DA REQUISIÇÃO getAll ===");
      const { search, category, brand, minPrice, maxPrice, sort } = filters;
      
      // Construir parâmetros validados
      const params = { page, limit };
      
      // Adicionar apenas parâmetros com valores definidos
      if (search) params.search = String(search).trim();
      if (category) params.category = String(category).trim();
      if (brand) params.brand = String(brand).trim();
      if (minPrice !== undefined) params.minPrice = Number(minPrice) || 0;
      if (maxPrice !== undefined) params.maxPrice = Number(maxPrice) || 5000;
      if (sort) params.sort = String(sort).trim();
      
      console.log("Parâmetros validados para API:", params);
      
      try {
        const response = await api.get('/products', { params });
        console.log("Resposta da API recebida com sucesso");
        
        return {
          products: response.data.products || [],
          pagination: response.data.pagination || { 
            total: 0, 
            pages: 1,
            currentPage: 1,
            perPage: limit
          }
        };
      } catch (apiError) {
        console.error('Erro na chamada à API:', apiError.message);
        console.error('Detalhes do erro:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          url: apiError.config?.url,
          params: apiError.config?.params
        });
        
        // Tentar uma segunda vez sem o parâmetro de busca se o erro for 500
        if (apiError.response?.status === 500 && params.search) {
          console.log("Tentando requisição novamente sem parâmetro de busca");
          const backupParams = { ...params };
          delete backupParams.search;
          
          // Tentativa de fallback
          try {
            const fallbackResponse = await api.get('/products', { params: backupParams });
            console.log("Fallback bem-sucedido");
            
            return {
              products: fallbackResponse.data.products || [],
              pagination: fallbackResponse.data.pagination || { 
                total: 0, 
                pages: 1,
                currentPage: 1,
                perPage: limit
              }
            };
          } catch (fallbackError) {
            console.error('Erro no fallback:', fallbackError.message);
            throw fallbackError;
          }
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    } finally {
      console.log("=== FIM DA REQUISIÇÃO getAll ===");
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

  delete: async (id) => {
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