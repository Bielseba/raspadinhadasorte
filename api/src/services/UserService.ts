import { User, UserRole } from '../entities/User';
import { IUserRepository } from '../repositories/UserRepository';
import * as bcrypt from 'bcryptjs';

export interface IUserService {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  validatePassword(user: User, password: string): Promise<boolean>;
  changePassword(userId: string, newPassword: string): Promise<boolean>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(data: Partial<User>): Promise<User> {
    // Validações de negócio
    if (!data.name || !data.email || !data.password) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    if (!this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    if (data.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.USER
    });

    return this.userRepository.create(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      return null;
    }

    // Validações de negócio para atualização
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    if (data.email && data.email !== existing.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }
    }

    if (data.password && data.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    // Criptografar nova senha se fornecida
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    if (newPassword.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await this.userRepository.update(userId, { password: hashedPassword });
    
    return updated !== null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 