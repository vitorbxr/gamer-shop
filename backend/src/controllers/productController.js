// backend/src/controllers/productController.js
import { PrismaClient } from '@prisma/client';
import { cacheService } from '../services/cacheService.js';
import { imageService } from '../services/imageService.js';

const prisma = new PrismaClient();

const getCacheKey = (params) => {
  return `products:${JSON.stringify(params)}`;
};

const clearProductsCache = async () => {
  await cacheService.clear();
};
const getAll = async (req, res) => {
    const params = {
      page: req.query.page || 1,
      limit: req.query.limit || 12,
      search: req.query.search,
      category: req.query.category,
      brand: req.query.brand,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sort: req.query.sort
    };
  
    const cacheKey = getCacheKey(params);
  
    try {
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
  
      const where = {
        isActive: true,
        AND: [
          params.search ? {
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { description: { contains: params.search, mode: 'insensitive' } }
            ]
          } : {},
          params.category ? { categoryId: parseInt(params.category) } : {},
          params.brand ? { brandId: parseInt(params.brand) } : {},
          params.minPrice ? { price: { gte: parseFloat(params.minPrice) } } : {},
          params.maxPrice ? { price: { lte: parseFloat(params.maxPrice) } } : {}
        ]
      };
  
      const orderBy = {};
      if (params.sort) {
        switch (params.sort) {
          case 'price-asc':
            orderBy.price = 'asc';
            break;
          case 'price-desc':
            orderBy.price = 'desc';
            break;
          case 'name':
            orderBy.name = 'asc';
            break;
          default:
            orderBy.createdAt = 'desc';
        }
      }
  
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: (params.page - 1) * params.limit,
          take: parseInt(params.limit),
          orderBy,
          include: {
            category: true,
            brand: true
          }
        }),
        prisma.product.count({ where })
      ]);
  
      const result = {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / parseInt(params.limit)),
          currentPage: parseInt(params.page)
        }
      };
  
      await cacheService.set(cacheKey, JSON.stringify(result));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getById = async (req, res) => {
    const { id } = req.params;
    try {
      const cacheKey = `product:${id}`;
      const cachedProduct = await cacheService.get(cacheKey);
      
      if (cachedProduct) {
        return res.json(JSON.parse(cachedProduct));
      }
  
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
  
      await cacheService.set(cacheKey, JSON.stringify(product));
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      }
  
      const images = await imageService.processImage(req.file);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const create = async (req, res) => {
    try {
      let imageUrls = null;
      if (req.file) {
        imageUrls = await imageService.processImage(req.file);
      }
  
      const product = await prisma.product.create({
        data: {
          ...req.body,
          image: imageUrls ? JSON.stringify(imageUrls) : null,
          specifications: req.body.specifications ? JSON.stringify(req.body.specifications) : null,
          features: req.body.features ? JSON.stringify(req.body.features) : null,
          categoryId: parseInt(req.body.categoryId),
          brandId: parseInt(req.body.brandId)
        },
        include: {
          category: true,
          brand: true
        }
      });
      
      await clearProductsCache();
      res.status(201).json(product);
    } catch (error) {
      if (req.file) {
        try {
          await imageService.deleteImages(req.file.path);
        } catch (e) {
          console.error('Erro ao remover imagem:', e);
        }
      }
      res.status(400).json({ error: error.message });
    }
  };
  
  const update = async (req, res) => {
    const { id } = req.params;
    try {
      let imageUrls = null;
      const oldProduct = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });
  
      if (req.file) {
        imageUrls = await imageService.processImage(req.file);
        if (oldProduct.image) {
          const oldImages = JSON.parse(oldProduct.image);
          await imageService.deleteImages(Object.values(oldImages));
        }
      }
  
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          ...req.body,
          image: imageUrls ? JSON.stringify(imageUrls) : undefined,
          specifications: req.body.specifications ? JSON.stringify(req.body.specifications) : undefined,
          features: req.body.features ? JSON.stringify(req.body.features) : undefined,
          categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : undefined,
          brandId: req.body.brandId ? parseInt(req.body.brandId) : undefined
        },
        include: {
          category: true,
          brand: true
        }
      });
      
      await clearProductsCache();
      res.json(product);
    } catch (error) {
      if (req.file) {
        try {
          await imageService.deleteImages(req.file.path);
        } catch (e) {
          console.error('Erro ao remover imagem:', e);
        }
      }
      res.status(400).json({ error: error.message });
    }
  };
  const remove = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });
  
      if (product.image) {
        const images = JSON.parse(product.image);
        await imageService.deleteImages(Object.values(images));
      }
  
      await prisma.product.delete({
        where: { id: parseInt(id) }
      });
      
      await clearProductsCache();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const getCategories = async (req, res) => {
    try {
      const cacheKey = 'categories';
      const cachedCategories = await cacheService.get(cacheKey);
      
      if (cachedCategories) {
        return res.json(JSON.parse(cachedCategories));
      }
  
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        }
      });
      
      await cacheService.set(cacheKey, JSON.stringify(categories));
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getBrands = async (req, res) => {
    try {
      const cacheKey = 'brands';
      const cachedBrands = await cacheService.get(cacheKey);
      
      if (cachedBrands) {
        return res.json(JSON.parse(cachedBrands));
      }
  
      const brands = await prisma.brand.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        }
      });
      
      await cacheService.set(cacheKey, JSON.stringify(brands));
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export const productController = {
    getAll,
    getById,
    create,
    update,
    delete: remove,
    getCategories,
    getBrands,
    uploadImage
  };