// backend/src/tests/product.test.js
import request from 'supertest';
import app from '../server.js';
import { testHelpers } from './helpers.js';

describe('Product API', () => {
  let adminToken;
  let categoryId;
  let brandId;

  beforeAll(async () => {
    const { token } = await testHelpers.createTestUser('ADMIN');
    adminToken = token;
    const category = await testHelpers.createTestCategory();
    const brand = await testHelpers.createTestBrand();
    categoryId = category.id;
    brandId = brand.id;
  });

  describe('GET /api/products', () => {
    it('should return list of products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body.products)).toBeTruthy();
    });

    it('should filter products by search term', async () => {
      const product = await testHelpers.createTestProduct(categoryId, brandId);
      
      const response = await request(app)
        .get(`/api/products?search=${product.name}`)
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].id).toBe(product.id);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Test Product',
        price: 199.99,
        description: 'Test description',
        stock: 10,
        categoryId,
        brandId
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.name).toBe(productData.name);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Dados inválidos');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const product = await testHelpers.createTestProduct(categoryId, brandId);
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const product = await testHelpers.createTestProduct(categoryId, brandId);

      await request(app)
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });
  });
});