// backend/src/controllers/productController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAll = async (req, res) => {
 const { 
   page = 1, 
   limit = 12, 
   search, 
   category, 
   brand, 
   minPrice, 
   maxPrice, 
   sort 
 } = req.query;

 const where = {
   isActive: true,
   AND: [
     search ? {
       OR: [
         { name: { contains: search, mode: 'insensitive' } },
         { description: { contains: search, mode: 'insensitive' } }
       ]
     } : {},
     category ? { categoryId: parseInt(category) } : {},
     brand ? { brandId: parseInt(brand) } : {},
     minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
     maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {}
   ]
 };

 const orderBy = {};
 if (sort) {
   switch (sort) {
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

 try {
   const [products, total] = await Promise.all([
     prisma.product.findMany({
       where,
       skip: (page - 1) * limit,
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
       pages: Math.ceil(total / parseInt(limit)),
       currentPage: parseInt(page)
     }
   });
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

const create = async (req, res) => {
 try {
   const product = await prisma.product.create({
     data: {
       ...req.body,
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
   res.status(201).json(product);
 } catch (error) {
   res.status(400).json({ error: error.message });
 }
};

const update = async (req, res) => {
 const { id } = req.params;
 try {
   const product = await prisma.product.update({
     where: { id: parseInt(id) },
     data: {
       ...req.body,
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
   res.json(product);
 } catch (error) {
   res.status(400).json({ error: error.message });
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
   res.status(400).json({ error: error.message });
 }
};

const getCategories = async (req, res) => {
 try {
   const categories = await prisma.category.findMany({
     include: {
       _count: {
         select: { products: true }
       }
     }
   });
   res.json(categories);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};

const getBrands = async (req, res) => {
 try {
   const brands = await prisma.brand.findMany({
     include: {
       _count: {
         select: { products: true }
       }
     }
   });
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
 getBrands
};