// backend/src/controllers/productController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const productController = {
  // Listar todos os produtos
  getAll: async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Criar novo produto
  create: async (req, res) => {
    try {
      const product = await prisma.product.create({
        data: {
          ...req.body,
          specifications: req.body.specifications ? JSON.stringify(req.body.specifications) : null,
          features: req.body.features ? JSON.stringify(req.body.features) : null
        }
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Atualizar produto
  update: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          ...req.body,
          specifications: req.body.specifications ? JSON.stringify(req.body.specifications) : undefined,
          features: req.body.features ? JSON.stringify(req.body.features) : undefined
        }
      });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Excluir produto
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.product.delete({
        where: { id: parseInt(id) }
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};