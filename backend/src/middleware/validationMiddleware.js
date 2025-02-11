export const validate = (schema) => {
  return (req, res, next) => {
    console.log('Dados recebidos para validação:', req.body);
    
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      console.log('Erro de validação:', error);
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors
      });
    }
    
    console.log('Dados validados:', value);
    req.body = value;
    next();
  };
};