import { Raspadinha, RaspadinhaStatus, IPrize } from '../entities/Raspadinha';
import { IRaspadinhaRepository } from '../repositories/RaspadinhaRepository';

export interface IRaspadinhaService {
  getAll(): Promise<Raspadinha[]>;
  getById(id: string): Promise<Raspadinha | null>;
  create(data: Partial<Raspadinha>): Promise<Raspadinha>;
  update(id: string, data: Partial<Raspadinha>): Promise<Raspadinha | null>;
  delete(id: string): Promise<boolean>;
  getAvailable(): Promise<Raspadinha[]>;
  deactivateExpired(): Promise<void>;
  generatePrize(raspadinhaId: string): Promise<IPrize | null>;
}

export class RaspadinhaService implements IRaspadinhaService {
  constructor(private raspadinhaRepository: IRaspadinhaRepository) {}

  async getAll(): Promise<Raspadinha[]> {
    return this.raspadinhaRepository.findAll();
  }

  async getById(id: string): Promise<Raspadinha | null> {
    return this.raspadinhaRepository.findById(id);
  }

  async create(data: Partial<Raspadinha>): Promise<Raspadinha> {
    // Validações de negócio
    if (!data.title || !data.price || !data.totalCards || !data.prizes) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    if (data.price <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    if (data.totalCards <= 0) {
      throw new Error('Total de cartas deve ser maior que zero');
    }

    // Validar probabilidades dos prêmios
    const totalProbability = data.prizes.reduce((sum, prize) => sum + prize.probability, 0);
    if (totalProbability > 100) {
      throw new Error('Soma das probabilidades dos prêmios não pode exceder 100%');
    }

    const raspadinha = new Raspadinha({
      title: data.title,
      description: data.description || '',
      image: data.image || '',
      price: data.price,
      totalCards: data.totalCards,
      prizes: data.prizes,
      expiresAt: data.expiresAt
    });

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

    if (data.prizes) {
      const totalProbability = data.prizes.reduce((sum, prize) => sum + prize.probability, 0);
      if (totalProbability > 100) {
        throw new Error('Soma das probabilidades dos prêmios não pode exceder 100%');
      }
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
      if (raspadinha.isExpired() && raspadinha.status === RaspadinhaStatus.ACTIVE) {
        await this.raspadinhaRepository.update(raspadinha.id, { 
          status: RaspadinhaStatus.EXPIRED 
        });
      }
    }
  }

  async generatePrize(raspadinhaId: string): Promise<IPrize | null> {
    const raspadinha = await this.raspadinhaRepository.findById(raspadinhaId);
    if (!raspadinha) {
      return null;
    }

    // Algoritmo simples de geração de prêmio baseado em probabilidade
    const random = Math.random() * 100;
    let accumulatedProbability = 0;

    for (const prize of raspadinha.prizes) {
      accumulatedProbability += prize.probability;
      if (random <= accumulatedProbability) {
        return prize;
      }
    }

    // Se não ganhou nenhum prêmio
    return null;
  }
} 