import { Request, Response } from 'express';
import { IAuthService } from '../services/AuthService';
import { ResponseHelper } from '../utils/responseHelpers';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      
      // Remove senha do usuário retornado
      const safeUser = { ...result.user, password: undefined };

      return ResponseHelper.success(res, {
        user: safeUser,
        token: result.token
      }, 'Login realizado com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message, 401);
    }
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.authService.register(req.body);
      
      // Remove senha do usuário retornado
      const safeUser = { ...result.user, password: undefined };

      return ResponseHelper.created(res, {
        user: safeUser,
        token: result.token
      }, 'Usuário registrado com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async validateToken(req: Request, res: Response): Promise<Response> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return ResponseHelper.unauthorized(res, 'Token não fornecido');
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return ResponseHelper.unauthorized(res, 'Token inválido');
      }

      const user = await this.authService.validateToken(token);
      
      if (!user) {
        return ResponseHelper.unauthorized(res, 'Token inválido');
      }

      // Remove senha do usuário retornado
      const safeUser = { ...user, password: undefined };

      return ResponseHelper.success(res, { user: safeUser }, 'Token válido');
    } catch (error: any) {
      return ResponseHelper.unauthorized(res, 'Token inválido');
    }
  }
} 