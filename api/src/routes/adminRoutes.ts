import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest, validateParams, validateQuery } from '../middlewares/validationMiddleware';
import { UserRole } from '../entities/User';
import * as Joi from 'joi';

// Schemas de validação para admin
const depositToUserSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().max(500).optional()
});

const reverseTransactionSchema = Joi.object({
  reason: Joi.string().max(500).required()
});

const transactionFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  userId: Joi.string().uuid().optional(),
  type: Joi.string().valid('deposit', 'withdrawal', 'transfer', 'purchase', 'refund').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
});

const walletFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const createAdminRoutes = (
  adminController: AdminController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  // Middleware para verificar se é admin
  const adminOnly = authMiddleware.authorize([UserRole.ADMIN]);

  // Rotas para transações do sistema
  router.get('/transactions',
    authMiddleware.authenticate,
    adminOnly,
    validateQuery(transactionFiltersSchema),
    adminController.getAllTransactions.bind(adminController)
  );

  // Rotas para transações de usuário específico
  router.get('/users/:userId/transactions',
    authMiddleware.authenticate,
    adminOnly,
    validateParams(Joi.object({ userId: Joi.string().uuid().required() })),
    validateQuery(Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20)
    })),
    adminController.getUserTransactions.bind(adminController)
  );

  // Rota para depositar dinheiro em usuário
  router.post('/users/:userId/deposit',
    authMiddleware.authenticate,
    adminOnly,
    validateParams(Joi.object({ userId: Joi.string().uuid().required() })),
    validateRequest(depositToUserSchema),
    adminController.depositToUser.bind(adminController)
  );

  // Rotas para carteiras
  router.get('/wallets',
    authMiddleware.authenticate,
    adminOnly,
    validateQuery(walletFiltersSchema),
    adminController.getAllWallets.bind(adminController)
  );

  // Rota para estatísticas do sistema
  router.get('/stats/system',
    authMiddleware.authenticate,
    adminOnly,
    adminController.getSystemStats.bind(adminController)
  );

  // Rota para reverter transação
  router.post('/transactions/:transactionId/reverse',
    authMiddleware.authenticate,
    adminOnly,
    validateParams(Joi.object({ transactionId: Joi.string().uuid().required() })),
    validateRequest(reverseTransactionSchema),
    adminController.reverseTransaction.bind(adminController)
  );

  return router;
};
