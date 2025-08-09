import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest, validateParams } from '../middlewares/validationMiddleware';
import { createUserSchema, updateUserSchema, idParamSchema } from '../utils/validators';
import { UserRole } from '../entities/User';
import * as Joi from 'joi';

const changePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required()
});

export const createUserRoutes = (
  userController: UserController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  // Rota para perfil do usuário autenticado
  router.get('/profile', 
    authMiddleware.authenticate,
    userController.profile.bind(userController)
  );

  // Rota para alterar senha
  router.put('/change-password', 
    authMiddleware.authenticate,
    validateRequest(changePasswordSchema),
    userController.changePassword.bind(userController)
  );

  // Rotas administrativas - apenas admin
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