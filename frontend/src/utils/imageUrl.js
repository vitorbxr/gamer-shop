// src/utils/imageUrl.js
import { API_URL } from '../config/api.config';

export const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return `${API_URL}/uploads${path}`;
};