import { Request, Response } from 'express';
import { IController } from '../interfaces/IController';
import { IRaspadinhaService } from '../services/RaspadinhaService';
import { ResponseHelper } from '../utils/responseHelpers';
import { AuthRequest } from '../middlewares/authMiddleware';

export class RaspadinhaController implements IController {
  constructor(private raspadinhaService: IRaspadinhaService) {}

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const raspadinhas = await this.raspadinhaService.getAll();
      return ResponseHelper.success(res, raspadinhas, 'Raspadinhas recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const raspadinha = await this.raspadinhaService.getById(id);
      
      if (!raspadinha) {
        return ResponseHelper.notFound(res, 'Raspadinha não encontrada');
      }

      return ResponseHelper.success(res, raspadinha, 'Raspadinha recuperada com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const raspadinha = await this.raspadinhaService.create(req.body);
      return ResponseHelper.created(res, raspadinha, 'Raspadinha criada com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const raspadinha = await this.raspadinhaService.update(id, req.body);
      
      if (!raspadinha) {
        return ResponseHelper.notFound(res, 'Raspadinha não encontrada');
      }

      return ResponseHelper.success(res, raspadinha, 'Raspadinha atualizada com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async destroy(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await this.raspadinhaService.delete(id);
      
      if (!deleted) {
        return ResponseHelper.notFound(res, 'Raspadinha não encontrada');
      }

      return ResponseHelper.success(res, null, 'Raspadinha removida com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async getAvailable(req: Request, res: Response): Promise<Response> {
    try {
      const raspadinhas = await this.raspadinhaService.getAvailable();
      return ResponseHelper.success(res, raspadinhas, 'Raspadinhas disponíveis recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async purchase(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return ResponseHelper.unauthorized(res, 'Usuário não autenticado');
      }

      const { id: raspadinhaId } = req.params;
      const userId = req.user.id;

      // Este método será implementado no PurchaseController
      // Aqui só retornamos uma resposta básica
      return ResponseHelper.success(res, { raspadinhaId, userId }, 'Rota de compra identificada');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }
} 