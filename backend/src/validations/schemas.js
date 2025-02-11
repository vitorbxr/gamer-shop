import Joi from 'joi';

export const schemas = {
  auth: {
    login: Joi.object({
      email: Joi.string().email().required()
        .messages({
          'string.email': 'Email inválido',
          'string.empty': 'Email é obrigatório'
        }),
      password: Joi.string().min(6).required()
        .messages({
          'string.empty': 'Senha é obrigatória',
          'string.min': 'Senha deve ter no mínimo 6 caracteres'
        })
    }),

    register: Joi.object({
      name: Joi.string().min(3).max(100).required()
        .messages({
          'string.empty': 'Nome é obrigatório',
          'string.min': 'Nome deve ter no mínimo 3 caracteres',
          'string.max': 'Nome deve ter no máximo 100 caracteres'
        }),
      email: Joi.string().email().required()
        .messages({
          'string.email': 'Email inválido',
          'string.empty': 'Email é obrigatório'
        }),
      password: Joi.string().min(6).required()
        .messages({
          'string.empty': 'Senha é obrigatória',
          'string.min': 'Senha deve ter no mínimo 6 caracteres'
        })
    })
  },
  
  product: {
    create: Joi.object({
      name: Joi.string().trim().min(3).max(100).required()
        .messages({
          'string.empty': 'Nome é obrigatório',
          'string.min': 'Nome deve ter no mínimo 3 caracteres',
          'string.max': 'Nome deve ter no máximo 100 caracteres'
        }),
      price: Joi.number().precision(2).min(0).required()
        .messages({
          'number.base': 'Preço deve ser um número',
          'number.min': 'Preço não pode ser negativo'
        }),
      description: Joi.string().trim().min(10).max(1000).required()
        .messages({
          'string.empty': 'Descrição é obrigatória',
          'string.min': 'Descrição deve ter no mínimo 10 caracteres',
          'string.max': 'Descrição deve ter no máximo 1000 caracteres'
        }),
      stock: Joi.number().integer().min(0).required()
        .messages({
          'number.base': 'Estoque deve ser um número',
          'number.integer': 'Estoque deve ser um número inteiro',
          'number.min': 'Estoque não pode ser negativo'
        }),
      categoryId: Joi.number().integer().required()
        .messages({
          'number.base': 'Categoria é obrigatória',
          'number.integer': 'ID da categoria deve ser um número inteiro'
        }),
      brandId: Joi.number().integer().required()
        .messages({
          'number.base': 'Marca é obrigatória',
          'number.integer': 'ID da marca deve ser um número inteiro'
        }),
      specifications: Joi.string().allow('').default(''),
      features: Joi.string().allow('').default(''),
      isActive: Joi.boolean().default(true),
      image: Joi.string().allow('', null).default(null)
    }),

    update: Joi.object({
      name: Joi.string().trim().min(3).max(100),
      price: Joi.number().precision(2).min(0),
      description: Joi.string().trim().min(10).max(1000),
      stock: Joi.number().integer().min(0),
      categoryId: Joi.number().integer(),
      brandId: Joi.number().integer(),
      specifications: Joi.string().allow('').default(''),
      features: Joi.string().allow('').default(''),
      isActive: Joi.boolean(),
      image: Joi.string().allow('', null)
    })
  }
};