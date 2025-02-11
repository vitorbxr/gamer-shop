import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const create = async (req, res) => {
  try {
    console.log('Body recebido:', req.body);

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      categoryId: Number(req.body.categoryId),
      brandId: Number(req.body.brandId),
      stock: Number(req.body.stock),
      specifications: req.body.specifications || '',  // Texto simples
      features: req.body.features || '',             // Texto simples
      isActive: true
    };

    console.log('Dados para criar:', productData);

    const product = await prisma.product.create({
      data: productData,
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

const getAll = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
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
    const productData = {
      ...req.body,
      specifications: req.body.specifications || '',  // Texto simples
      features: req.body.features || ''              // Texto simples
    };

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: productData,
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
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 8,
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