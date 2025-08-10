// Container de Injeção de Dependência
// Seguindo o princípio de Inversão de Dependência (D do SOLID)

import { UserRepository } from '../repositories/UserRepository';
import { RaspadinhaRepository } from '../repositories/RaspadinhaRepository';
import { PurchaseRepository } from '../repositories/PurchaseRepository';
import { UserService } from '../services/UserService';
import { RaspadinhaService } from '../services/RaspadinhaService';
import { PurchaseService } from '../services/PurchaseService';
import { AuthService } from '../services/AuthService';
import { UserController } from '../controllers/UserController';
import { RaspadinhaController } from '../controllers/RaspadinhaController';
import { PurchaseController } from '../controllers/PurchaseController';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { initializeDatabase } from './database';

export class Container {
  public userRepository: UserRepository;
  public raspadinhaRepository: RaspadinhaRepository;
  public purchaseRepository: PurchaseRepository;
  public userService: UserService;
  public raspadinhaService: RaspadinhaService;
  public purchaseService: PurchaseService;
  public authService: AuthService;
  public userController: UserController;
  public raspadinhaController: RaspadinhaController;
  public purchaseController: PurchaseController;
  public authController: AuthController;
  public authMiddleware: AuthMiddleware;

  constructor() {
    this.userRepository = new UserRepository();
    this.raspadinhaRepository = new RaspadinhaRepository();
    this.purchaseRepository = new PurchaseRepository();
    
    this.userService = new UserService(this.userRepository);
    this.raspadinhaService = new RaspadinhaService(this.raspadinhaRepository);
    this.purchaseService = new PurchaseService(this.purchaseRepository, this.raspadinhaRepository, this.userRepository);
    this.authService = new AuthService(this.userRepository);
    
    this.userController = new UserController(this.userService);
    this.raspadinhaController = new RaspadinhaController(this.raspadinhaService);
    this.purchaseController = new PurchaseController(this.purchaseService);
    this.authController = new AuthController(this.authService);
    
    this.authMiddleware = new AuthMiddleware(this.authService);
  }

  public static async create(): Promise<Container> {
    // Inicializar conexão com o banco de dados
    await initializeDatabase();
    return new Container();
  }
} 