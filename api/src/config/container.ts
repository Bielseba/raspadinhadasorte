// Container de Injeção de Dependência
// Seguindo o princípio de Inversão de Dependência (D do SOLID)

import { RaspadinhaRepository, IRaspadinhaRepository } from '../repositories/RaspadinhaRepository';
import { UserRepository, IUserRepository } from '../repositories/UserRepository';
import { PurchaseRepository, IPurchaseRepository } from '../repositories/PurchaseRepository';

import { RaspadinhaService, IRaspadinhaService } from '../services/RaspadinhaService';
import { UserService, IUserService } from '../services/UserService';
import { PurchaseService, IPurchaseService } from '../services/PurchaseService';
import { AuthService, IAuthService } from '../services/AuthService';

import { RaspadinhaController } from '../controllers/RaspadinhaController';
import { UserController } from '../controllers/UserController';
import { PurchaseController } from '../controllers/PurchaseController';
import { AuthController } from '../controllers/AuthController';

import { AuthMiddleware } from '../middlewares/authMiddleware';

export class Container {
  // Repositórios
  public readonly raspadinhaRepository: IRaspadinhaRepository;
  public readonly userRepository: IUserRepository;
  public readonly purchaseRepository: IPurchaseRepository;

  // Serviços
  public readonly raspadinhaService: IRaspadinhaService;
  public readonly userService: IUserService;
  public readonly purchaseService: IPurchaseService;
  public readonly authService: IAuthService;

  // Controladores
  public readonly raspadinhaController: RaspadinhaController;
  public readonly userController: UserController;
  public readonly purchaseController: PurchaseController;
  public readonly authController: AuthController;

  // Middlewares
  public readonly authMiddleware: AuthMiddleware;

  constructor() {
    // Instanciar repositórios
    this.raspadinhaRepository = new RaspadinhaRepository();
    this.userRepository = new UserRepository();
    this.purchaseRepository = new PurchaseRepository();

    // Instanciar serviços com injeção de dependência
    this.raspadinhaService = new RaspadinhaService(this.raspadinhaRepository);
    this.userService = new UserService(this.userRepository);
    this.authService = new AuthService(this.userService);
    this.purchaseService = new PurchaseService(
      this.purchaseRepository,
      this.raspadinhaService,
      this.userService
    );

    // Instanciar controladores com injeção de dependência
    this.raspadinhaController = new RaspadinhaController(this.raspadinhaService);
    this.userController = new UserController(this.userService);
    this.purchaseController = new PurchaseController(this.purchaseService);
    this.authController = new AuthController(this.authService);

    // Instanciar middlewares
    this.authMiddleware = new AuthMiddleware(this.authService);
  }

  // Método para inicializar dados de exemplo (útil para desenvolvimento)
  async initializeData(): Promise<void> {
    try {
      // Criar usuário admin padrão
      await this.userService.create({
        name: 'Administrador',
        email: 'admin../raspadinhadasorte.com',
        password: 'admin123',
        role: 'admin' as any
      });

      // Criar raspadinha de exemplo
      await this.raspadinhaService.create({
        title: 'Raspadinha de Exemplo',
        description: 'Uma raspadinha para testar o sistema',
        image: 'exemplo.jpg',
        price: 5.00,
        totalCards: 100,
        prizes: [
          {
            id: 'prize1',
            type: 'money' as any,
            name: 'R$ 50,00',
            value: 50,
            probability: 5
          },
          {
            id: 'prize2',
            type: 'money' as any,
            name: 'R$ 20,00',
            value: 20,
            probability: 10
          },
          {
            id: 'prize3',
            type: 'money' as any,
            name: 'R$ 5,00',
            value: 5,
            probability: 25
          }
        ]
      });

      console.log('Dados iniciais carregados com sucesso!');
    } catch (error) {
      console.log('Dados já existem ou erro ao carregar:', error);
    }
  }
} 