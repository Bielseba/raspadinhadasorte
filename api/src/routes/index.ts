import { Router } from 'express';
import { createRaspadinhaRoutes } from './raspadinhaRoutes';
import { createUserRoutes } from './userRoutes';
import { createAuthRoutes } from './authRoutes';
import { createPurchaseRoutes } from './purchaseRoutes';
import { createAdminRoutes } from './adminRoutes';
import { Container } from '../config/container';

export const createRoutes = (container: Container): Router => {
  const router = Router();

  // Rota de health check
  router.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Rotas da aplicação
  router.use('/auth', createAuthRoutes(container.authController));
  router.use('/raspadinhas', createRaspadinhaRoutes(container.raspadinhaController, container.authMiddleware));
  router.use('/users', createUserRoutes(container.userController, container.walletController, container.transactionController, container.authMiddleware));
  router.use('/purchases', createPurchaseRoutes(container.purchaseController, container.authMiddleware));
  
  // Rotas administrativas
  router.use('/admin', createAdminRoutes(container.adminController, container.authMiddleware));

  return router;
}; 