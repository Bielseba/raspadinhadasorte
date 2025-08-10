import { Repository } from 'typeorm';
import { Raspadinha, RaspadinhaStatus, RaspadinhaType } from '../entities/Raspadinha';
import { AppDataSource } from '../config/database';
import { IRepository } from '../interfaces/IRepository';

export class RaspadinhaRepository implements IRepository<Raspadinha> {
  private repository: Repository<Raspadinha>;

  constructor() {
    this.repository = AppDataSource.getRepository(Raspadinha);
  }

  async findAll(): Promise<Raspadinha[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Raspadinha | null> {
    return await this.repository.findOne({
      where: { id, isActive: true }
    });
  }

  async create(data: Partial<Raspadinha>): Promise<Raspadinha> {
    const raspadinha = this.repository.create(data);
    return await this.repository.save(raspadinha);
  }

  async update(id: string, data: Partial<Raspadinha>): Promise<Raspadinha | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: false });
    return result.affected ? result.affected > 0 : false;
  }

  async findAvailable(): Promise<Raspadinha[]> {
    return await this.repository.find({
      where: { 
        status: RaspadinhaStatus.AVAILABLE, 
        isActive: true 
      },
      order: { price: 'ASC' }
    });
  }

  async findByType(type: RaspadinhaType): Promise<Raspadinha[]> {
    return await this.repository.find({
      where: { 
        type, 
        status: RaspadinhaStatus.AVAILABLE, 
        isActive: true 
      }
    });
  }

  async findByStatus(status: RaspadinhaStatus): Promise<Raspadinha[]> {
    return await this.repository.find({
      where: { status, isActive: true }
    });
  }

  async countAvailable(): Promise<number> {
    return await this.repository.count({
      where: { 
        status: RaspadinhaStatus.AVAILABLE, 
        isActive: true 
      }
    });
  }

  async markAsSold(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { 
      status: RaspadinhaStatus.SOLD 
    });
    return result.affected ? result.affected > 0 : false;
  }

  async markAsScratched(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { 
      status: RaspadinhaStatus.SCRATCHED 
    });
    return result.affected ? result.affected > 0 : false;
  }
} 