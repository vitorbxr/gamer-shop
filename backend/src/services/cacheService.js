// backend/src/services/cacheService.js
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.connect();

const CACHE_DURATION = 5 * 60; // 5 minutos em segundos

export const cacheService = {
  get: async (key) => {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  },

  set: async (key, value) => {
    await client.set(key, JSON.stringify(value), {
      EX: CACHE_DURATION
    });
  },

  del: async (key) => {
    await client.del(key);
  },

  clear: async () => {
    await client.flushDb();
  }
};