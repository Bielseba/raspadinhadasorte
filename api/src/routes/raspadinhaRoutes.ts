import { Router } from 'express';
import { RaspadinhaController } from '../controllers/RaspadinhaController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest, validateParams } from '../middlewares/validationMiddleware';
import { createRaspadinhaSchema, updateRaspadinhaSchema, idParamSchema } from '../utils/validators';
import { UserRole } from '../entities/User';

export const createRaspadinhaRoutes = (
  raspadinhaController: RaspadinhaController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  // Rotas públicas
  router.get('/', raspadinhaController.index.bind(raspadinhaController));
  router.get('/available', raspadinhaController.getAvailable.bind(raspadinhaController));
  router.get('/:id', 
    validateParams(idParamSchema),
    raspadinhaController.show.bind(raspadinhaController)
  );

  // Rotas protegidas - apenas admin
  router.post('/', 
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateRequest(createRaspadinhaSchema),
    raspadinhaController.store.bind(raspadinhaController)
  );

  router.put('/:id', 
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    validateRequest(updateRaspadinhaSchema),
    raspadinhaController.update.bind(raspadinhaController)
  );

  router.delete('/:id', 
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    raspadinhaController.destroy.bind(raspadinhaController)
  );

  return router;
}; 