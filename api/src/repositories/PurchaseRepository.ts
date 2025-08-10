import { Repository } from 'typeorm';
import { Purchase, PurchaseStatus } from '../entities/Purchase';
import { AppDataSource } from '../config/database';
import { IRepository } from '../interfaces/IRepository';

export class PurchaseRepository implements IRepository<Purchase> {
  private repository: Repository<Purchase>;

  constructor() {
    this.repository = AppDataSource.getRepository(Purchase);
  }

  async findAll(): Promise<Purchase[]> {
    return await this.repository.find({
      relations: ['user', 'raspadinha'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Purchase | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user', 'raspadinha']
    });
  }

  async create(data: Partial<Purchase>): Promise<Purchase> {
    const purchase = this.repository.create(data);
    return await this.repository.save(purchase);
  }

  async update(id: string, data: Partial<Purchase>): Promise<Purchase | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByUserId(userId: string): Promise<Purchase[]> {
    return await this.repository.find({
      where: { userId },
      relations: ['raspadinha'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByRaspadinhaId(raspadinhaId: string): Promise<Purchase[]> {
    return await this.repository.find({
      where: { raspadinhaId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: PurchaseStatus): Promise<Purchase[]> {
    return await this.repository.find({
      where: { status },
      relations: ['user', 'raspadinha'],
      order: { createdAt: 'DESC' }
    });
  }

  async findPendingPurchases(): Promise<Purchase[]> {
    return await this.repository.find({
      where: { status: PurchaseStatus.PENDING },
      relations: ['user', 'raspadinha']
    });
  }

  async findCompletedPurchases(): Promise<Purchase[]> {
    return await this.repository.find({
      where: { status: PurchaseStatus.COMPLETED },
      relations: ['user', 'raspadinha'],
      order: { createdAt: 'DESC' }
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId }
    });
  }

  async countByStatus(status: PurchaseStatus): Promise<number> {
    return await this.repository.count({
      where: { status }
    });
  }

  async markAsCompleted(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { 
      status: PurchaseStatus.COMPLETED 
    });
    return result.affected ? result.affected > 0 : false;
  }

  async markAsScratched(id: string, winnings: number): Promise<boolean> {
    const result = await this.repository.update(id, { 
      status: PurchaseStatus.COMPLETED,
      isScratched: true,
      winnings,
      scratchedAt: new Date()
    });
    return result.affected ? result.affected > 0 : false;
  }
} 