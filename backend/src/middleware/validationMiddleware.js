// backend/src/middleware/validationMiddleware.js
import { logService } from '../services/logService.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logService.warn('Validação falhou', {
        errors,
        body: req.body,
        userId: req.user?.id
      });

      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors
      });
    }
    
    next();
  };
};