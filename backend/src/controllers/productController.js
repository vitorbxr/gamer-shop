import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    // Busca produtos com paginação
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip: Number(skip),
        take: Number(limit),
        include: {
          category: true,
          brand: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count() // Total de produtos para paginação
    ]);

    res.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        perPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
      include: {
        category: true,
        brand: true
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        brand: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: req.body,
      include: {
        category: true,
        brand: true
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeatured = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: Number(limit),
      orderBy: { updatedAt: 'desc' },
      include: {
        category: true,
        brand: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const productController = {
  create,
  getAll,
  getById,
  update,
  delete: remove,
  getFeatured,
  getCategories,
  getBrands
};