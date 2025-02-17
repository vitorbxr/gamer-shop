// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { requestLogger, errorLogger, securityLogger } from './middleware/logMiddleware.js';
import { setupLogRotation } from './utils/logRotation.js';
import { logService } from './services/logService.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do dotenv
dotenv.config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Middlewares de log
app.use(requestLogger);
app.use(securityLogger);

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log de todas as requisições
app.use((req, res, next) => {
 logService.request(req);
 next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);

// Handler para rotas não encontradas
app.use((req, res) => {
 logService.warn('Rota não encontrada', {
   method: req.method,
   url: req.url,
   userId: req.user?.id
 });
 res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro na requisição:', {
    path: req.path,
    method: req.method,
    error: {
      message: err.message,
      stack: err.stack
    }
  });
  next(err);
});

// Middlewares de erro
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error('Erro detalhado:', err);
  next(err);
});
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Iniciar rotação de logs
setupLogRotation();

// Iniciar servidor
app.listen(PORT, () => {
 logService.info(`Servidor iniciado na porta ${PORT}`, {
   port: PORT,
   environment: process.env.NODE_ENV,
   nodeVersion: process.version,
   startTime: new Date().toISOString()
 });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
 logService.error('Erro não capturado', error);
 process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
 logService.error('Promessa rejeitada não tratada', reason);
});

// Tratamento de desligamento gracioso
process.on('SIGTERM', () => {
 logService.info('Servidor está sendo desligado');
 process.exit(0);
});

process.on('SIGINT', () => {
 logService.info('Servidor interrompido pelo usuário');
 process.exit(0);
});

export default app;