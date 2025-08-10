import { User } from '../entities/User';
import { UserService } from './UserService';
import * as jwt from 'jsonwebtoken';

export interface IAuthService {
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  register(userData: { name: string; email: string; password: string }): Promise<{ user: User; token: string }>;
  validateToken(token: string): Promise<User | null>;
  generateToken(user: User): string;
}

export class AuthService implements IAuthService {
  constructor(private userService: UserService) {}

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new Error('Usuário inativo');
    }

    const isValidPassword = await this.userService.validatePassword(user, password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async register(userData: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const user = await this.userService.create(userData);
    const token = this.generateToken(user);

    return { user, token };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      
      return this.userService.getById(decoded.userId);
    } catch (error) {
      return null;
    }
  }

  generateToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn }
    );
  }
} 