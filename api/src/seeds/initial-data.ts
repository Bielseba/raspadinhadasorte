import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { Raspadinha, RaspadinhaType } from '../entities/Raspadinha';
import { UserRepository } from '../repositories/UserRepository';
import { RaspadinhaRepository } from '../repositories/RaspadinhaRepository';
import bcrypt from 'bcryptjs';

export class InitialDataSeeder {
  private userRepository: UserRepository;
  private raspadinhaRepository: RaspadinhaRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.raspadinhaRepository = new RaspadinhaRepository();
  }

  async seed(): Promise<void> {
    try {
      console.log('🌱 Iniciando seed dos dados iniciais...');

      // Criar usuário admin
      await this.createAdminUser();

      // Criar raspadinhas de exemplo
      await this.createSampleRaspadinhas();

      console.log('✅ Dados iniciais criados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar dados iniciais:', error);
      throw error;
    }
  }

  private async createAdminUser(): Promise<void> {
    const existingAdmin = await this.userRepository.findByEmail('admin@raspadinhadasorte.com');
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        name: 'Administrador',
        phone: '81 9999999999',
        email: 'admin@raspadinhadasorte.com',
        password: hashedPassword,
        role: UserRole.ADMIN
      });

      await this.userRepository.create(adminUser);
      console.log('👑 Usuário admin criado');
    } else {
      console.log('👑 Usuário admin já existe');
    }
  }

  private async createSampleRaspadinhas(): Promise<void> {
    const existingRaspadinhas = await this.raspadinhaRepository.findAll();
    
    if (existingRaspadinhas.length === 0) {
      const raspadinhas = [
        {
          name: 'Raspadinha Prata',
          description: 'Raspadinha básica com prêmios menores',
          price: 5.00,
          type: RaspadinhaType.SILVER,
          maxWinnings: 50
        },
        {
          name: 'Raspadinha Dourada',
          description: 'Raspadinha intermediária com prêmios médios',
          price: 10.00,
          type: RaspadinhaType.GOLD,
          maxWinnings: 100
        },
        {
          name: 'Raspadinha Platina',
          description: 'Raspadinha premium com prêmios maiores',
          price: 20.00,
          type: RaspadinhaType.PLATINUM,
          maxWinnings: 500
        }
      ];

      for (const raspadinhaData of raspadinhas) {
        const raspadinha = new Raspadinha(raspadinhaData);
        await this.raspadinhaRepository.create(raspadinha);
      }

      console.log('🎯 Raspadinhas de exemplo criadas');
    } else {
      console.log('🎯 Raspadinhas já existem');
    }
  }
}

// Função para executar o seed
export const runSeed = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    const seeder = new InitialDataSeeder();
    await seeder.seed();
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

// Executar se executado diretamente
if (require.main === module) {
  runSeed();
} 