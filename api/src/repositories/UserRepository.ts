import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/User';
import { AppDataSource } from '../config/database';
import { IRepository } from '../interfaces/IRepository';

export class UserRepository implements IRepository<User> {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id, isActive: true }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email, isActive: true }
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: false });
    return result.affected ? result.affected > 0 : false;
  }

  async findAdmins(): Promise<User[]> {
    return await this.repository.find({
      where: { role: UserRole.ADMIN, isActive: true }
    });
  }

  async countUsers(): Promise<number> {
    return await this.repository.count({
      where: { isActive: true }
    });
  }
} 