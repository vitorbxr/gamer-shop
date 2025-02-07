// backend/src/utils/logRotation.js
import fs from 'fs';
import path from 'path';
import { logService } from '../services/logService.js';

const MAX_LOG_DAYS = 30;
const LOGS_DIR = path.join(process.cwd(), 'logs');

export const setupLogRotation = () => {
  // Executa diariamente à meia-noite
  setInterval(() => {
    try {
      const currentDate = new Date();
      const files = fs.readdirSync(path.join(LOGS_DIR, 'daily'));

      files.forEach(file => {
        const filePath = path.join(LOGS_DIR, 'daily', file);
        const stats = fs.statSync(filePath);
        const daysOld = (currentDate - stats.mtime) / (1000 * 60 * 60 * 24);

        if (daysOld > MAX_LOG_DAYS) {
          fs.unlinkSync(filePath);
          logService.info('Log antigo removido', { file });
        }
      });
    } catch (error) {
      logService.error('Erro na rotação de logs', error);
    }
  }, 24 * 60 * 60 * 1000);
};