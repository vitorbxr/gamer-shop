// backend/src/controllers/productController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const productController = {
  getAll: async (req, res) => {
    const { page = 1, limit = 12, category, brand, minPrice, maxPrice, search, sort } = req.query;
    const skip = (page - 1) * parseInt(limit);

    try {
      const where = {
        isActive: true,
        ...(category && { categoryId: parseInt(category) }),
        ...(brand && { brandId: parseInt(brand) }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
        ...(search && {
          name: { contains: search, mode: 'insensitive' }
        })
      };

      const orderBy = sort ? {
        price: sort === 'price-asc' ? 'asc' : 'desc'
      } : { createdAt: 'desc' };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy,
          include: {
            category: true,
            brand: true
          }
        }),
        prisma.product.count({ where })
      ]);

      res.json({
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBrands: async (req, res) => {
    try {
      const brands = await prisma.brand.findMany();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};