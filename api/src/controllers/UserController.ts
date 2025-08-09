import { Request, Response } from 'express';
import { IController } from '../interfaces/IController';
import { IUserService } from '../services/UserService';
import { ResponseHelper } from '../utils/responseHelpers';
import { AuthRequest } from '../middlewares/authMiddleware';

export class UserController implements IController {
  constructor(private userService: IUserService) {}

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAll();
      
      // Remove senha dos usuários retornados
      const safeUsers = users.map(user => ({
        ...user,
        password: undefined
      }));

      return ResponseHelper.success(res, safeUsers, 'Usuários recuperados com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await this.userService.getById(id);
      
      if (!user) {
        return ResponseHelper.notFound(res, 'Usuário não encontrado');
      }

      // Remove senha do usuário retornado
      const safeUser = { ...user, password: undefined };

      return ResponseHelper.success(res, safeUser, 'Usuário recuperado com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.create(req.body);
      
      // Remove senha do usuário retornado
      const safeUser = { ...user, password: undefined };

      return ResponseHelper.created(res, safeUser, 'Usuário criado com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await this.userService.update(id, req.body);
      
      if (!user) {
        return ResponseHelper.notFound(res, 'Usuário não encontrado');
      }

      // Remove senha do usuário retornado
      const safeUser = { ...user, password: undefined };

      return ResponseHelper.success(res, safeUser, 'Usuário atualizado com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async destroy(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await this.userService.delete(id);
      
      if (!deleted) {
        return ResponseHelper.notFound(res, 'Usuário não encontrado');
      }

      return ResponseHelper.success(res, null, 'Usuário removido com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async profile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return ResponseHelper.unauthorized(res, 'Usuário não autenticado');
      }

      const user = await this.userService.getById(req.user.id);
      
      if (!user) {
        return ResponseHelper.notFound(res, 'Usuário não encontrado');
      }

      // Remove senha do usuário retornado
      const safeUser = { ...user, password: undefined };

      return ResponseHelper.success(res, safeUser, 'Perfil recuperado com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async changePassword(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return ResponseHelper.unauthorized(res, 'Usuário não autenticado');
      }

      const { newPassword } = req.body;
      const success = await this.userService.changePassword(req.user.id, newPassword);
      
      if (!success) {
        return ResponseHelper.error(res, 'Não foi possível alterar a senha');
      }

      return ResponseHelper.success(res, null, 'Senha alterada com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }
} 