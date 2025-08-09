import { Purchase, PurchaseStatus } from '../entities/Purchase';
import { InMemoryRepository } from './InMemoryRepository';

export interface IPurchaseRepository {
  findAll(): Promise<Purchase[]>;
  findById(id: string): Promise<Purchase | null>;
  create(data: Partial<Purchase>): Promise<Purchase>;
  update(id: string, data: Partial<Purchase>): Promise<Purchase | null>;
  delete(id: string): Promise<boolean>;
  findByUserId(userId: string): Promise<Purchase[]>;
  findByRaspadinhaId(raspadinhaId: string): Promise<Purchase[]>;
  findByStatus(status: PurchaseStatus): Promise<Purchase[]>;
}

export class PurchaseRepository extends InMemoryRepository<Purchase> implements IPurchaseRepository {
  
  async findByUserId(userId: string): Promise<Purchase[]> {
    return this.findManyByField('userId', userId);
  }

  async findByRaspadinhaId(raspadinhaId: string): Promise<Purchase[]> {
    return this.findManyByField('raspadinhaId', raspadinhaId);
  }

  async findByStatus(status: PurchaseStatus): Promise<Purchase[]> {
    return this.findManyByField('status', status);
  }
} 