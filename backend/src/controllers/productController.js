import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    console.log("====== DEBUG BUSCA DE PRODUTOS ======");
    console.log("Query params completos:", req.query);
    
    // Extrair parâmetros com valores padrão seguros
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 12);
    const search = req.query.search || '';
    const category = req.query.category || '';
    const brand = req.query.brand || '';
    const minPrice = parseFloat(req.query.minPrice || 0);
    const maxPrice = parseFloat(req.query.maxPrice || 5000);
    const sort = req.query.sort || '';
    
    console.log("Parâmetros processados:", {
      page, limit, search, category, brand, minPrice, maxPrice, sort
    });
    
    const skip = (page - 1) * limit;
    
    // Construir filtros básicos
    let where = {};
    
    try {
      // Adicionar filtro de texto para busca
      if (search && search.trim() !== '') {
        console.log("Adicionando filtro de busca para:", search);
        where.OR = [
          { name: { contains: search } }
          // Remover filtro de descrição temporariamente para debug
          // { description: { contains: search } }
        ];
      }
      
      // Filtro de categorias
      if (category && category.trim() !== '') {
        try {
          const categoryIds = category.split(',').map(id => parseInt(id, 10));
          console.log("Filtro de categorias:", categoryIds);
          
          if (categoryIds.length === 1) {
            where.categoryId = categoryIds[0];
          } else if (categoryIds.length > 1) {
            where.categoryId = { in: categoryIds };
          }
        } catch (error) {
          console.error("Erro ao processar categorias:", error);
        }
      }
      
      // Filtro de marcas
      if (brand && brand.trim() !== '') {
        try {
          const brandIds = brand.split(',').map(id => parseInt(id, 10));
          console.log("Filtro de marcas:", brandIds);
          
          if (brandIds.length === 1) {
            where.brandId = brandIds[0];
          } else if (brandIds.length > 1) {
            where.brandId = { in: brandIds };
          }
        } catch (error) {
          console.error("Erro ao processar marcas:", error);
        }
      }
      
      // Filtro de preço
      where.price = {
        gte: minPrice,
        lte: maxPrice
      };
      
      console.log("Filtro WHERE final:", JSON.stringify(where, null, 2));
      
      // Configurar ordenação
      let orderBy = { createdAt: 'desc' };
      
      if (sort) {
        switch (sort) {
          case 'price-asc':
            orderBy = { price: 'asc' };
            break;
          case 'price-desc':
            orderBy = { price: 'desc' };
            break;
          case 'name':
            orderBy = { name: 'asc' };
            break;
          default:
            orderBy = { createdAt: 'desc' };
        }
      }
      
      console.log("Ordem:", orderBy);
      
      // Busca produtos - dividida em duas etapas para identificar onde está o erro
      console.log("Preparando para executar consulta Prisma...");
      
      // Primeiro obtém produtos
      console.log("Buscando produtos...");
      const products = await prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true
        },
        orderBy
      });
      
      console.log(`Encontrados ${products.length} produtos`);
      
      // Depois conta total
      console.log("Contando total de produtos...");
      const total = await prisma.product.count({ where });
      
      console.log(`Total de produtos: ${total}`);
      
      res.json({
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit
        }
      });
      
    } catch (innerError) {
      console.error("ERRO DETALHADO NA CONSTRUÇÃO DA CONSULTA:", innerError);
      throw innerError; // Relançar para ser capturado pelo try/catch externo
    }
    
  } catch (error) {
    console.error('ERRO CRÍTICO ao buscar produtos:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: error.message,
      errorDetail: error.toString(),
      stack: error.stack
    });
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