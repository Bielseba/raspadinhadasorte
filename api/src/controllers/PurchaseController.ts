import { Request, Response } from 'express';
import { IController } from '../interfaces/IController';
import { IPurchaseService } from '../services/PurchaseService';
import { ResponseHelper } from '../utils/responseHelpers';
import { AuthRequest } from '../middlewares/authMiddleware';

export class PurchaseController implements IController {
  constructor(private purchaseService: IPurchaseService) {}

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const purchases = await this.purchaseService.getAll();
      return ResponseHelper.success(res, purchases, 'Compras recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const purchase = await this.purchaseService.getById(id);
      
      if (!purchase) {
        return ResponseHelper.notFound(res, 'Compra não encontrada');
      }

      return ResponseHelper.success(res, purchase, 'Compra recuperada com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const purchase = await this.purchaseService.create(req.body);
      return ResponseHelper.created(res, purchase, 'Compra criada com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const purchase = await this.purchaseService.update(id, req.body);
      
      if (!purchase) {
        return ResponseHelper.notFound(res, 'Compra não encontrada');
      }

      return ResponseHelper.success(res, purchase, 'Compra atualizada com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async destroy(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await this.purchaseService.delete(id);
      
      if (!deleted) {
        return ResponseHelper.notFound(res, 'Compra não encontrada');
      }

      return ResponseHelper.success(res, null, 'Compra removida com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  async purchaseRaspadinha(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return ResponseHelper.unauthorized(res, 'Usuário não autenticado');
      }

      const { raspadinhaId } = req.body;
      const userId = req.user.id;

      const purchase = await this.purchaseService.purchaseRaspadinha(userId, raspadinhaId);
      
      return ResponseHelper.created(res, purchase, 'Raspadinha comprada com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async scratchCard(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return ResponseHelper.unauthorized(res, 'Usuário não autenticado');
      }

      const { id: purchaseId } = req.params;
      
      // Verificar se a compra pertence ao usuário autenticado
      const purchase = await this.purchaseService.getById(purchaseId);
      if (!purchase) {
        return ResponseHelper.notFound(res, 'Compra não encontrada');
      }

      if (purchase.userId !== req.user.id) {
        return ResponseHelper.forbidden(res, 'Você não tem permissão para raspar esta carta');
      }

      const scratchedPurchase = await this.purchaseService.scratchCard(purchaseId);
      
      if (!scratchedPurchase) {
        return ResponseHelper.error(res, 'Não foi possível raspar a carta');
      }

      return ResponseHelper.success(res, scratchedPurchase, 'Carta raspada com sucesso');
    } catch (error: any) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async getUserPurchases(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return ResponseHelper.unauthorized(res, 'Usuário não autenticado');
      }

      const purchases = await this.purchaseService.getUserPurchases(req.user.id);
      
      return ResponseHelper.success(res, purchases, 'Compras do usuário recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }
} 