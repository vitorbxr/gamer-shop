// backend/src/services/imageService.js
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export const imageService = {
  async processImage(file) {
    const filename = file.filename;
    const uploadPath = path.resolve('./uploads/products');
    
    // Gera diferentes tamanhos da imagem
    try {
      // Thumbnail (200x200)
      await sharp(file.path)
        .resize(200, 200, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(uploadPath, `thumb_${filename}.webp`));

      // Média (600x600)
      await sharp(file.path)
        .resize(600, 600, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(path.join(uploadPath, `medium_${filename}.webp`));

      // Grande (1200x1200)
      await sharp(file.path)
        .resize(1200, 1200, { fit: 'contain' })
        .webp({ quality: 90 })
        .toFile(path.join(uploadPath, `large_${filename}.webp`));

      // Remove o arquivo original
      await fs.unlink(file.path);

      return {
        thumbnail: `/products/thumb_${filename}.webp`,
        medium: `/products/medium_${filename}.webp`,
        large: `/products/large_${filename}.webp`
      };
    } catch (error) {
      // Em caso de erro, tenta remover os arquivos que podem ter sido criados
      const sizes = ['thumb', 'medium', 'large'];
      for (const size of sizes) {
        try {
          await fs.unlink(path.join(uploadPath, `${size}_${filename}.webp`));
        } catch (e) {
          // Ignora erros ao tentar remover arquivos que podem não existir
        }
      }
      throw error;
    }
  },

  async deleteImages(imageUrls) {
    const uploadPath = path.resolve('./uploads/products');
    
    try {
      if (typeof imageUrls === 'string') {
        imageUrls = [imageUrls];
      }

      for (const url of imageUrls) {
        const filename = path.basename(url);
        await fs.unlink(path.join(uploadPath, filename));
      }
    } catch (error) {
      console.error('Erro ao deletar imagens:', error);
      throw error;
    }
  }
};