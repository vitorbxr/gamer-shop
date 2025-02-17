// backend/src/controllers/couponController.js
import { prisma } from '../lib/prisma.js';

export const couponController = {
  // Criar novo cupom
  create: async (req, res) => {
    try {
      const { 
        code, 
        type,
        value,
        minValue,
        maxUses,
        startDate,
        endDate 
      } = req.body;

      // Validações básicas
      if (!code || !type || !value || !startDate || !endDate) {
        return res.status(400).json({ 
          message: 'Todos os campos obrigatórios devem ser preenchidos' 
        });
      }

      // Validar datas
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        return res.status(400).json({ 
          message: 'A data de término deve ser posterior à data de início' 
        });
      }

      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          type,
          value: Number(value),
          minValue: minValue ? Number(minValue) : null,
          maxUses: maxUses ? parseInt(maxUses) : null,
          startDate: start,
          endDate: end,
          isActive: true,
          usedCount: 0
        }
      });

      res.status(201).json(coupon);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Código de cupom já existe' });
      }
      console.error('Erro ao criar cupom:', error);
      res.status(500).json({ message: 'Erro ao criar cupom' });
    }
  },

  // Listar todos os cupons
  getAll: async (req, res) => {
    try {
      const coupons = await prisma.coupon.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(coupons);
    } catch (error) {
      console.error('Erro ao listar cupons:', error);
      res.status(500).json({ message: 'Erro ao buscar cupons' });
    }
  },

  // Buscar cupom por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await prisma.coupon.findUnique({
        where: { id: parseInt(id) }
      });

      if (!coupon) {
        return res.status(404).json({ message: 'Cupom não encontrado' });
      }

      res.json(coupon);
    } catch (error) {
      console.error('Erro ao buscar cupom:', error);
      res.status(500).json({ message: 'Erro ao buscar cupom' });
    }
  },

  // Atualizar cupom
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        code,
        type,
        value,
        minValue,
        maxUses,
        startDate,
        endDate,
        isActive 
      } = req.body;

      // Validar datas se fornecidas
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end <= start) {
          return res.status(400).json({ 
            message: 'A data de término deve ser posterior à data de início' 
          });
        }
      }

      const coupon = await prisma.coupon.update({
        where: { id: parseInt(id) },
        data: {
          code: code?.toUpperCase(),
          type,
          value: value ? Number(value) : undefined,
          minValue: minValue ? Number(minValue) : null,
          maxUses: maxUses ? parseInt(maxUses) : null,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          isActive
        }
      });

      res.json(coupon);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Código de cupom já existe' });
      }
      console.error('Erro ao atualizar cupom:', error);
      res.status(500).json({ message: 'Erro ao atualizar cupom' });
    }
  },

  // Validar cupom
  validate: async (req, res) => {
    try {
      const { code, cartTotal } = req.body;

      if (!code || !cartTotal) {
        return res.status(400).json({ 
          valid: false,
          message: 'Código do cupom e valor do carrinho são obrigatórios'
        });
      }

      const now = new Date();
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: code.toUpperCase(),
          isActive: true,
        }
      });

      if (!coupon) {
        return res.status(404).json({ 
          valid: false, 
          message: 'Cupom não encontrado ou inativo' 
        });
      }

      // Validar status do cupom
      const validationErrors = [];

      // Verificar data de validade
      if (now < coupon.startDate) {
        validationErrors.push(`Cupom só será válido a partir de ${coupon.startDate.toLocaleDateString()}`);
      }
      
      if (now > coupon.endDate) {
        validationErrors.push('Cupom expirado');
        // Desativar cupom automaticamente
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { isActive: false }
        });
      }

      // Verificar limite de usos
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        validationErrors.push('Limite de uso deste cupom foi atingido');
        // Desativar cupom automaticamente
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { isActive: false }
        });
      }

      // Verificar valor mínimo
      if (coupon.minValue && cartTotal < coupon.minValue) {
        validationErrors.push(`Valor mínimo para este cupom é €${coupon.minValue.toFixed(2)}`);
      }

      // Se houver erros, retorna o primeiro erro
      if (validationErrors.length > 0) {
        return res.status(400).json({
          valid: false,
          message: validationErrors[0]
        });
      }

      // Calcular desconto
      let discount;
      if (coupon.type === 'PERCENTAGE') {
        discount = (cartTotal * coupon.value) / 100;
      } else {
        discount = Math.min(coupon.value, cartTotal);
      }

      res.json({
        valid: true,
        coupon: {
          ...coupon,
          discount: Number(discount.toFixed(2)),
          remainingUses: coupon.maxUses ? coupon.maxUses - coupon.usedCount : null
        }
      });
    } catch (error) {
      console.error('Erro ao validar cupom:', error);
      res.status(500).json({ 
        valid: false,
        message: 'Erro ao validar cupom' 
      });
    }
  },

  // Aplicar cupom no pedido
  apply: async (req, res) => {
    try {
      const { code, orderId } = req.body;

      if (!code || !orderId) {
        return res.status(400).json({ 
          message: 'Código do cupom e ID do pedido são obrigatórios'
        });
      }

      // Buscar cupom
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: code.toUpperCase(),
          isActive: true
        }
      });

      if (!coupon) {
        return res.status(404).json({ message: 'Cupom não encontrado' });
      }

      // Verificar se ainda tem usos disponíveis
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        // Desativar cupom automaticamente
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { isActive: false }
        });
        return res.status(400).json({ message: 'Cupom atingiu o limite máximo de usos' });
      }

      // Buscar pedido
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) }
      });

      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      // Verificar valor mínimo
      if (coupon.minValue && order.totalAmount < coupon.minValue) {
        return res.status(400).json({ 
          message: `Valor mínimo para este cupom é €${coupon.minValue.toFixed(2)}` 
        });
      }

      // Usar transação para garantir a atomicidade das operações
      const [updatedOrder, updatedCoupon] = await prisma.$transaction([
        // Atualiza o pedido com o cupom
        prisma.order.update({
          where: { id: parseInt(orderId) },
          data: {
            couponId: coupon.id,
          }
        }),
        // Incrementa o uso do cupom
        prisma.coupon.update({
          where: { id: coupon.id },
          data: {
            usedCount: {
              increment: 1
            },
            // Desativa o cupom se atingiu o limite de usos
            isActive: coupon.maxUses ? (coupon.usedCount + 1) < coupon.maxUses : true
          }
        })
      ]);

      res.json(updatedOrder);
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      res.status(500).json({ message: 'Erro ao aplicar cupom' });
    }
  }
};