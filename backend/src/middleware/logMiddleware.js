// backend/src/middleware/logMiddleware.js
import { logService } from '../services/logService.js';

export const requestLogger = (req, res, next) => {
  // Log da requisição
  logService.request(req);

  // Captura o tempo de resposta
  const start = Date.now();
  
  // Intercepta a finalização da resposta
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logService.info('API Response', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      userRole: req.user?.role
    });
  });

  next();
};

export const errorLogger = (err, req, res, next) => {
  logService.error('API Error', err, {
    method: req.method,
    url: req.url,
    userId: req.user?.id,
    userRole: req.user?.role
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
};