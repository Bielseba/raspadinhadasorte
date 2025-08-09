import * as Joi from 'joi';
import { PrizeType, RaspadinhaStatus } from '../entities/Raspadinha';
import { UserRole } from '../entities/User';

// Validações para Raspadinha
export const createRaspadinhaSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().max(500),
  image: Joi.string(),
  price: Joi.number().positive().required(),
  totalCards: Joi.number().integer().positive().required(),
  prizes: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      type: Joi.string().valid(...Object.values(PrizeType)).required(),
      name: Joi.string().required().min(3).max(100),
      value: Joi.number().positive().required(),
      image: Joi.string(),
      probability: Joi.number().min(0).max(100).required()
    })
  ).required(),
  expiresAt: Joi.date().greater('now')
});

export const updateRaspadinhaSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  image: Joi.string(),
  price: Joi.number().positive(),
  totalCards: Joi.number().integer().positive(),
  status: Joi.string().valid(...Object.values(RaspadinhaStatus)),
  prizes: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      type: Joi.string().valid(...Object.values(PrizeType)).required(),
      name: Joi.string().required().min(3).max(100),
      value: Joi.number().positive().required(),
      image: Joi.string(),
      probability: Joi.number().min(0).max(100).required()
    })
  ),
  expiresAt: Joi.date().greater('now')
});

// Validações para User
export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(...Object.values(UserRole))
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid(...Object.values(UserRole)),
  isActive: Joi.boolean()
});

// Validações para Auth
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Validações para parâmetros
export const idParamSchema = Joi.object({
  id: Joi.string().required()
});

// Validações para query
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
}); 