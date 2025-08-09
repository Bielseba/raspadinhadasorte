import { Router } from 'express';
import { createRaspadinhaRoutes } from './raspadinhaRoutes';
import { createUserRoutes } from './userRoutes';
import { createAuthRoutes } from './authRoutes';
import { createPurchaseRoutes } from './purchaseRoutes';
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
  router.use('/users', createUserRoutes(container.userController, container.authMiddleware));
  router.use('/purchases', createPurchaseRoutes(container.purchaseController, container.authMiddleware));

  return router;
}; 