import { User, UserRole } from '../entities/User';
import { InMemoryRepository } from './InMemoryRepository';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
}

export class UserRepository extends InMemoryRepository<User> implements IUserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    return this.findByField('email', email);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.findManyByField('role', role);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.data.filter(user => user.isActive);
  }
} 