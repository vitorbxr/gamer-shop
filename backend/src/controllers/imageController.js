// backend/src/controllers/imageController.js
import multer from 'multer';
import path from 'path';
import { imageService } from '../services/imageService.js';

// Configuração do Multer
const storage = multer.diskStorage({
  destination: './uploads/products',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WEBP.'), false);
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const imageController = {
  async uploadProductImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
      }

      const imageUrls = await imageService.processImage(req.file);
      
      res.json({
        message: 'Imagens processadas com sucesso',
        urls: imageUrls
      });
    } catch (error) {
      console.error('Erro no processamento da imagem:', error);
      res.status(500).json({ 
        error: 'Erro ao processar imagem',
        details: error.message 
      });
    }
  },

  async deleteProductImage(req, res) {
    try {
      const { urls } = req.body;
      
      if (!urls) {
        return res.status(400).json({ error: 'URLs das imagens não fornecidas' });
      }

      await imageService.deleteImages(urls);
      
      res.json({ 
        message: 'Imagens deletadas com sucesso' 
      });
    } catch (error) {
      console.error('Erro ao deletar imagens:', error);
      res.status(500).json({ 
        error: 'Erro ao deletar imagens',
        details: error.message 
      });
    }
  }
};