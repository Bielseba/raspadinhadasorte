import { Purchase, PurchaseStatus } from '../entities/Purchase';
import { PurchaseRepository } from '../repositories/PurchaseRepository';
import { RaspadinhaService } from './RaspadinhaService';
import { IUserService } from './UserService';

export interface IPurchaseService {
  getAll(): Promise<Purchase[]>;
  getById(id: string): Promise<Purchase | null>;
  create(data: Partial<Purchase>): Promise<Purchase>;
  update(id: string, data: Partial<Purchase>): Promise<Purchase | null>;
  delete(id: string): Promise<boolean>;
  purchaseRaspadinha(userId: string, raspadinhaId: string): Promise<Purchase>;
  scratchCard(purchaseId: string): Promise<Purchase | null>;
  getUserPurchases(userId: string): Promise<Purchase[]>;
}

export class PurchaseService implements IPurchaseService {
  constructor(
    private purchaseRepository: PurchaseRepository,
    private raspadinhaService: RaspadinhaService,
    private userService: IUserService
  ) {}

  async getAll(): Promise<Purchase[]> {
    return this.purchaseRepository.findAll();
  }

  async getById(id: string): Promise<Purchase | null> {
    return this.purchaseRepository.findById(id);
  }

  async create(data: Partial<Purchase>): Promise<Purchase> {
    if (!data.userId || !data.raspadinhaId || !data.amount) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    const purchase = new Purchase({
      userId: data.userId,
      raspadinhaId: data.raspadinhaId,
      amount: data.amount
    });

    return this.purchaseRepository.create(purchase);
  }

  async update(id: string, data: Partial<Purchase>): Promise<Purchase | null> {
    return this.purchaseRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.purchaseRepository.delete(id);
  }

  async purchaseRaspadinha(userId: string, raspadinhaId: string): Promise<Purchase> {
    // Verificar se usuário existe
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se raspadinha existe e está disponível
    const raspadinha = await this.raspadinhaService.getById(raspadinhaId);
    if (!raspadinha) {
      throw new Error('Raspadinha não encontrada');
    }

    if (!raspadinha.canBePurchased()) {
      throw new Error('Raspadinha não está disponível para compra');
    }

    // Criar a compra
    const purchase = new Purchase({
      userId,
      raspadinhaId,
      amount: raspadinha.price
    });

    // Completar a compra
    purchase.complete();

    // Diminuir cartas disponíveis
    raspadinha.decreaseAvailableCards();
    await this.raspadinhaService.update(raspadinhaId, {
      availableCards: raspadinha.availableCards
    });

    return this.purchaseRepository.create(purchase);
  }

  async scratchCard(purchaseId: string): Promise<Purchase | null> {
    const purchase = await this.purchaseRepository.findById(purchaseId);
    if (!purchase) {
      throw new Error('Compra não encontrada');
    }

    if (purchase.status !== PurchaseStatus.COMPLETED) {
      throw new Error('Compra não foi completada');
    }

    if (purchase.isScratched) {
      throw new Error('Carta já foi raspada');
    }

    // Gerar prêmio
    const prize = await this.raspadinhaService.generatePrize(purchase.raspadinhaId);
    
    // Raspar a carta
    purchase.scratch(prize || undefined);

    // Atualizar no repositório
    return this.purchaseRepository.update(purchaseId, {
      isScratched: purchase.isScratched,
      scratchedAt: purchase.scratchedAt,
      prize: purchase.prize
    });
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    return this.purchaseRepository.findByUserId(userId);
  }
} 