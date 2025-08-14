import { Raspadinha, RaspadinhaStatus } from '../entities/Raspadinha';
import { RaspadinhaRepository } from '../repositories/RaspadinhaRepository';

export interface IRaspadinhaService {
  getAll(): Promise<Raspadinha[]>;
  getById(id: string): Promise<Raspadinha | null>;
  create(data: Partial<Raspadinha>): Promise<Raspadinha>;
  update(id: string, data: Partial<Raspadinha>): Promise<Raspadinha | null>;
  delete(id: string): Promise<boolean>;
  getAvailable(): Promise<Raspadinha[]>;
  deactivateExpired(): Promise<void>;
  generatePrize(raspadinhaId: string): Promise<number | null>;
}

export class RaspadinhaService implements IRaspadinhaService {
  constructor(private raspadinhaRepository: RaspadinhaRepository) {}

  async getAll(): Promise<Raspadinha[]> {
    return this.raspadinhaRepository.findAll();
  }

  async getById(id: string): Promise<Raspadinha | null> {
    return this.raspadinhaRepository.findById(id);
  }

  async create(data: Partial<Raspadinha>): Promise<Raspadinha> {
    // Validações de negócio
    if (!data.name || !data.price || !data.availableCards) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    if (data.price <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    if (data.availableCards <= 0) {
      throw new Error('Total de cartas deve ser maior que zero');
    }

    const raspadinha = new Raspadinha({
      name: data.name,
      description: data.description || '',
      price: data.price
    });
    
    // Definir availableCards após a criação
    if (data.availableCards !== undefined) {
      raspadinha.availableCards = data.availableCards;
    }

    return this.raspadinhaRepository.create(raspadinha);
  }

  async update(id: string, data: Partial<Raspadinha>): Promise<Raspadinha | null> {
    const existing = await this.raspadinhaRepository.findById(id);
    if (!existing) {
      return null;
    }

    // Validações de negócio para atualização
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    if (data.availableCards !== undefined && data.availableCards < 0) {
      throw new Error('Total de cartas não pode ser negativo');
    }

    return this.raspadinhaRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.raspadinhaRepository.delete(id);
  }

  async getAvailable(): Promise<Raspadinha[]> {
    return this.raspadinhaRepository.findAvailable();
  }

  async deactivateExpired(): Promise<void> {
    const allRaspadinhas = await this.raspadinhaRepository.findAll();
    
    for (const raspadinha of allRaspadinhas) {
      if (raspadinha.availableCards === 0 && raspadinha.status === RaspadinhaStatus.AVAILABLE) {
        await this.raspadinhaRepository.update(raspadinha.id, { 
          status: RaspadinhaStatus.SOLD 
        });
      }
    }
  }

  async generatePrize(raspadinhaId: string): Promise<number | null> {
    const raspadinha = await this.raspadinhaRepository.findById(raspadinhaId);
    if (!raspadinha) {
      return null;
    }

    // Lógica simples para gerar prêmio baseado no tipo da raspadinha
    const basePrize = raspadinha.price * 0.1; // 10% do preço como base
    const randomMultiplier = Math.random() * 2 + 0.5; // Entre 0.5x e 2.5x
    
    return Math.round(basePrize * randomMultiplier);
  }
} 