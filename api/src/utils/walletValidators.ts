import * as Joi from 'joi';

// Validações para depósito
export const depositSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'O valor deve ser um número',
      'number.positive': 'O valor deve ser positivo',
      'number.precision': 'O valor deve ter no máximo 2 casas decimais',
      'any.required': 'O valor é obrigatório'
    }),
  description: Joi.string().max(500).optional()
    .messages({
      'string.max': 'A descrição deve ter no máximo 500 caracteres'
    })
});

// Validações para saque
export const withdrawSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'O valor deve ser um número',
      'number.positive': 'O valor deve ser positivo',
      'number.precision': 'O valor deve ter no máximo 2 casas decimais',
      'any.required': 'O valor é obrigatório'
    }),
  description: Joi.string().max(500).optional()
    .messages({
      'string.max': 'A descrição deve ter no máximo 500 caracteres'
    })
});

// Validações para transferência
export const transferSchema = Joi.object({
  targetUserId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'ID do usuário de destino deve ser um UUID válido',
      'any.required': 'ID do usuário de destino é obrigatório'
    }),
  amount: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'O valor deve ser um número',
      'number.positive': 'O valor deve ser positivo',
      'number.precision': 'O valor deve ter no máximo 2 casas decimais',
      'any.required': 'O valor é obrigatório'
    }),
  description: Joi.string().max(500).optional()
    .messages({
      'string.max': 'A descrição deve ter no máximo 500 caracteres'
    })
});

// Validações para filtros de transações
export const transactionFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'A página deve ser um número',
      'number.integer': 'A página deve ser um número inteiro',
      'number.min': 'A página deve ser maior que 0'
    }),
  limit: Joi.number().integer().min(1).max(100).default(20)
    .messages({
      'number.base': 'O limite deve ser um número',
      'number.integer': 'O limite deve ser um número inteiro',
      'number.min': 'O limite deve ser maior que 0',
      'number.max': 'O limite deve ser menor ou igual a 100'
    }),
  type: Joi.string().valid('deposit', 'withdrawal', 'transfer', 'purchase', 'refund').optional()
    .messages({
      'any.only': 'O tipo deve ser um dos valores válidos: deposit, withdrawal, transfer, purchase, refund'
    }),
  startDate: Joi.date().iso().optional()
    .messages({
      'date.base': 'A data de início deve ser uma data válida',
      'date.format': 'A data de início deve estar no formato ISO'
    }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
    .messages({
      'date.base': 'A data de fim deve ser uma data válida',
      'date.format': 'A data de fim deve estar no formato ISO',
      'date.min': 'A data de fim deve ser posterior à data de início'
    })
});

// Validações para filtros de carteira
export const walletFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'A página deve ser um número',
      'number.integer': 'A página deve ser um número inteiro',
      'number.min': 'A página deve ser maior que 0'
    }),
  limit: Joi.number().integer().min(1).max(100).default(20)
    .messages({
      'number.base': 'O limite deve ser um número',
      'number.integer': 'O limite deve ser um número inteiro',
      'number.min': 'O limite deve ser maior que 0',
      'number.max': 'O limite deve ser menor ou igual a 100'
    })
});

// Validações para exportação
export const exportSchema = Joi.object({
  format: Joi.string().valid('csv').default('csv')
    .messages({
      'any.only': 'O formato deve ser CSV'
    }),
  startDate: Joi.date().iso().optional()
    .messages({
      'date.base': 'A data de início deve ser uma data válida',
      'date.format': 'A data de início deve estar no formato ISO'
    }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
    .messages({
      'date.base': 'A data de fim deve ser uma data válida',
      'date.format': 'A data de fim deve estar no formato ISO',
      'date.min': 'A data de fim deve ser posterior à data de início'
    })
});

// Validações para resumo mensal
export const monthlySummarySchema = Joi.object({
  year: Joi.number().integer().min(2020).max(2030).optional()
    .messages({
      'number.base': 'O ano deve ser um número',
      'number.integer': 'O ano deve ser um número inteiro',
      'number.min': 'O ano deve ser maior ou igual a 2020',
      'number.max': 'O ano deve ser menor ou igual a 2030'
    }),
  month: Joi.number().integer().min(1).max(12).optional()
    .messages({
      'number.base': 'O mês deve ser um número',
      'number.integer': 'O mês deve ser um número inteiro',
      'number.min': 'O mês deve ser maior ou igual a 1',
      'number.max': 'O mês deve ser menor ou igual a 12'
    })
});

// Validações para depósito administrativo
export const adminDepositSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'O valor deve ser um número',
      'number.positive': 'O valor deve ser positivo',
      'number.precision': 'O valor deve ter no máximo 2 casas decimais',
      'any.required': 'O valor é obrigatório'
    }),
  description: Joi.string().max(500).optional()
    .messages({
      'string.max': 'A descrição deve ter no máximo 500 caracteres'
    })
});

// Validações para reversão de transação
export const reverseTransactionSchema = Joi.object({
  reason: Joi.string().max(500).required()
    .messages({
      'string.max': 'O motivo deve ter no máximo 500 caracteres',
      'any.required': 'O motivo é obrigatório'
    })
});
