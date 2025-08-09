import { Raspadinha, RaspadinhaStatus } from '../entities/Raspadinha';
import { InMemoryRepository } from './InMemoryRepository';

export interface IRaspadinhaRepository {
  findAll(): Promise<Raspadinha[]>;
  findById(id: string): Promise<Raspadinha | null>;
  create(data: Partial<Raspadinha>): Promise<Raspadinha>;
  update(id: string, data: Partial<Raspadinha>): Promise<Raspadinha | null>;
  delete(id: string): Promise<boolean>;
  findByStatus(status: RaspadinhaStatus): Promise<Raspadinha[]>;
  findAvailable(): Promise<Raspadinha[]>;
}

export class RaspadinhaRepository extends InMemoryRepository<Raspadinha> implements IRaspadinhaRepository {
  
  async findByStatus(status: RaspadinhaStatus): Promise<Raspadinha[]> {
    return this.findManyByField('status', status);
  }

  async findAvailable(): Promise<Raspadinha[]> {
    return this.data.filter(raspadinha => raspadinha.canBePurchased());
  }
} 