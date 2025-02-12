// src/config/urls.js
export const getImageUrl = (path) => {
    if (!path) return '/placeholder-product.png';
    // Se a URL já for absoluta (começa com http ou https), retorna ela mesma
    if (path.startsWith('http')) return path;
    // Se não, retorna o caminho relativo
    return path;
  };