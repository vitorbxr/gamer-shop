// backend/src/services/logService.js
import winston from 'winston';
import path from 'path';

const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.metadata()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    // Logs de erro
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Logs de operações críticas
    new winston.transports.File({ 
      filename: 'logs/critical.log', 
      level: 'warn',
      maxsize: 5242880,
      maxFiles: 5
    }),
    // Todos os logs
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    }),
    // Logs separados por data
    new winston.transports.File({
      filename: `logs/daily/${new Date().toISOString().split('T')[0]}.log`,
      maxsize: 5242880
    })
  ]
});

// Adiciona logs no console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export const logService = {
  info: (message, meta = {}) => {
    logger.info(message, { metadata: meta });
  },

  error: (message, error, meta = {}) => {
    logger.error(message, {
      metadata: {
        ...meta,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      }
    });
  },

  warn: (message, meta = {}) => {
    logger.warn(message, { metadata: meta });
  },

  debug: (message, meta = {}) => {
    logger.debug(message, { metadata: meta });
  },

  request: (req, meta = {}) => {
    logger.info('API Request', {
      metadata: {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body,
        userId: req.user?.id,
        userRole: req.user?.role,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        ...meta
      }
    });
  },

  security: (message, meta = {}) => {
    logger.warn(message, {
      metadata: {
        ...meta,
        type: 'SECURITY'
      }
    });
  },

  performance: (message, duration, meta = {}) => {
    logger.info(message, {
      metadata: {
        ...meta,
        duration,
        type: 'PERFORMANCE'
      }
    });
  }
};