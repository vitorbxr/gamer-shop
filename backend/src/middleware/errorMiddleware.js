// backend/src/middleware/errorMiddleware.js
import { logService } from '../services/logService.js';

export const errorHandler = (err, req, res, next) => {
  // Log do erro
  logService.error('Erro na aplicação', err, {
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });

  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Erro do Multer (upload de arquivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'Arquivo muito grande',
      message: 'O tamanho máximo permitido é 5MB'
    });
  }

  // Outros erros do Multer
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Arquivo não esperado',
      message: 'Apenas um arquivo pode ser enviado por vez'
    });
  }

  // Erro padrão
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor'
      : err.message
  });
};