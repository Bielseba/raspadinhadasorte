import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest, validateParams, validateQuery } from '../middlewares/validationMiddleware';
import { createUserSchema, updateUserSchema, idParamSchema } from '../utils/validators';
import { UserRole } from '../entities/User';
import * as Joi from 'joi';
import { WalletController } from '../controllers/WalletController';
import { TransactionController } from '../controllers/TransactionController';

const changePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required()
});

// Schemas de validação para carteira e transações
const depositSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().max(500).optional()
});

const withdrawSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().max(500).optional()
});

const transferSchema = Joi.object({
  targetUserId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().max(500).optional()
});

const transactionFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  type: Joi.string().valid('deposit', 'withdrawal', 'transfer', 'purchase', 'refund').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
});

export const createUserRoutes = (
  userController: UserController,
  walletController: WalletController,
  transactionController: TransactionController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  // Rota para perfil do usuário autenticado
  router.get('/profile',
    authMiddleware.authenticate,
    userController.profile.bind(userController)
  );

  router.put('/profile/:id',
    authMiddleware.authenticate,
    validateParams(idParamSchema),
    userController.update.bind(userController)
  );

  // Rota para alterar senha
  router.put('/change-password',
    authMiddleware.authenticate,
    validateRequest(changePasswordSchema),
    userController.changePassword.bind(userController)
  );

  // ===== ROTAS DE CARTEIRA =====
  
  // GET /:userId/balance - Ver saldo da carteira
  router.get('/:userId/balance',
    authMiddleware.authenticate,
    walletController.getBalance.bind(walletController));

  // POST /:userId/deposit - Depositar valor na carteira
  router.post('/:userId/deposit',
    authMiddleware.authenticate,
    validateRequest(depositSchema),
    walletController.deposit.bind(walletController));

  // POST /:userId/withdraw - Sacar valor da carteira
  router.post('/:userId/withdraw',
    authMiddleware.authenticate,
    validateRequest(withdrawSchema),
    walletController.withdraw.bind(walletController));

  // POST /:userId/transfer - Transferir dinheiro para outro usuário
  router.post('/:userId/transfer',
    authMiddleware.authenticate,
    validateRequest(transferSchema),
    walletController.transfer.bind(walletController));

  // GET /:userId/stats - Ver estatísticas pessoais
  router.get('/:userId/stats',
    authMiddleware.authenticate,
    walletController.getPersonalStats.bind(walletController));

  // ===== ROTAS DE TRANSAÇÕES =====

  // GET /:userId/transactions/recent - Ver últimas transações
  router.get('/:userId/transactions/recent', 
    authMiddleware.authenticate,
    validateQuery(Joi.object({ limit: Joi.number().integer().min(1).max(100).default(10) })),
    transactionController.getLastTransactions.bind(transactionController));

  // GET /:userId/transactions - Ver histórico completo de transações
  router.get('/:userId/transactions',
    authMiddleware.authenticate,
    validateQuery(transactionFiltersSchema),
    walletController.getTransactionHistory.bind(walletController));

  // GET /:userId/transactions/:transactionId - Ver transação específica
  router.get('/:userId/transactions/:transactionId',
    authMiddleware.authenticate,
    validateParams(Joi.object({ 
      userId: Joi.string().uuid().required(),
      transactionId: Joi.string().uuid().required()
    })),
    transactionController.getTransaction.bind(transactionController));

  // GET /:userId/transactions/export - Exportar transações
  router.get('/:userId/transactions/export',
    authMiddleware.authenticate,
    validateQuery(Joi.object({
      format: Joi.string().valid('csv').default('csv'),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional()
    })),
    transactionController.exportTransactions.bind(transactionController));

  // GET /:userId/transactions/monthly-summary - Ver resumo mensal
  router.get('/:userId/transactions/monthly-summary',
    authMiddleware.authenticate,
    validateQuery(Joi.object({
      year: Joi.number().integer().min(2020).max(2030).optional(),
      month: Joi.number().integer().min(1).max(12).optional()
    })),
    transactionController.getMonthlySummary.bind(transactionController));

  // GET /:userId/transactions/categories - Ver categorias de transações
  router.get('/:userId/transactions/categories',
    authMiddleware.authenticate,
    transactionController.getTransactionCategories.bind(transactionController));

  // ===== ROTAS ADMINISTRATIVAS =====
  
  router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    userController.index.bind(userController)
  );

  router.get('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    userController.show.bind(userController)
  );

  router.post('/',
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateRequest(createUserSchema),
    userController.store.bind(userController)
  );

  router.put('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    validateRequest(updateUserSchema),
    userController.update.bind(userController)
  );

  router.delete('/:id',
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    userController.destroy.bind(userController)
  );

  return router;
}; 