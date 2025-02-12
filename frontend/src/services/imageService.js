// frontend/src/services/imageService.js
import api from './api';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

export const imageService = {
  async upload(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.urls;
  },

  async delete(urls) {
    await api.delete('/images/delete', { data: { urls } });
  }
};