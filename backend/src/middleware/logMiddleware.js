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

  next(err);
};

export const securityLogger = (req, res, next) => {
  // Log de tentativas de acesso não autorizado
  if (req.url.includes('/admin') && (!req.user || req.user.role !== 'ADMIN')) {
    logService.security('Tentativa de acesso não autorizado', {
      url: req.url,
      userId: req.user?.id,
      ip: req.ip
    });
  }

  next();
};