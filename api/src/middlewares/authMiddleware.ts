import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/AuthService';
import { UserRole } from '../entities/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export class AuthMiddleware {
  constructor(private authService: IAuthService) {}

  authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({ error: 'Token de acesso requerido' });
        return;
      }

      const token = authHeader.split(' ')[1]; // Bearer TOKEN
      
      if (!token) {
        res.status(401).json({ error: 'Token de acesso inválido' });
        return;
      }

      const user = await this.authService.validateToken(token);
      
      if (!user) {
        res.status(401).json({ error: 'Token de acesso inválido' });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      next();
    } catch (error) {
      res.status(401).json({ error: 'Token de acesso inválido' });
    }
  };

  authorize = (roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Acesso negado' });
        return;
      }

      next();
    };
  };
} 