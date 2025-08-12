import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { loginSchema, registerSchema } from '../utils/validators';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/login', 
    validateRequest(loginSchema),
    authController.login.bind(authController)
  );

  router.post('/register', 
    // validateRequest(registerSchema),
    authController.register.bind(authController)
  );

  router.post('/validate-token', 
    authController.validateToken.bind(authController)
  );

  return router;
}; 