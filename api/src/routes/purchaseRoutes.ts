import { Router } from 'express';
import { PurchaseController } from '../controllers/PurchaseController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest, validateParams } from '../middlewares/validationMiddleware';
import { idParamSchema } from '../utils/validators';
import { UserRole } from '../entities/User';
import * as Joi from 'joi';

const purchaseRaspadinhaSchema = Joi.object({
  raspadinhaId: Joi.string().required()
});

export const createPurchaseRoutes = (
  purchaseController: PurchaseController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  // Rotas para usuários autenticados
  router.post('/purchase', 
    authMiddleware.authenticate,
    validateRequest(purchaseRaspadinhaSchema),
    purchaseController.purchaseRaspadinha.bind(purchaseController)
  );

  router.post('/:id/scratch', 
    authMiddleware.authenticate,
    validateParams(idParamSchema),
    purchaseController.scratchCard.bind(purchaseController)
  );

  router.get('/my-purchases', 
    authMiddleware.authenticate,
    purchaseController.getUserPurchases.bind(purchaseController)
  );

  // Rotas administrativas - apenas admin
  router.get('/', 
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    purchaseController.index.bind(purchaseController)
  );

  router.get('/:id', 
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    purchaseController.show.bind(purchaseController)
  );

  router.put('/:id', 
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    purchaseController.update.bind(purchaseController)
  );

  router.delete('/:id', 
    authMiddleware.authenticate,
    authMiddleware.authorize([UserRole.ADMIN]),
    validateParams(idParamSchema),
    purchaseController.destroy.bind(purchaseController)
  );

  return router;
}; 