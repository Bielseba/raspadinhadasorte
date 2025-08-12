import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Wallet } from '../entities/Wallet';

export interface IWalletRepository {
  create(wallet: Partial<Wallet>): Promise<Wallet>;
  findByUserId(userId: string): Promise<Wallet | null>;
  update(id: string, data: Partial<Wallet>): Promise<Wallet | null>;
}

export class WalletRepository implements IWalletRepository {
  private repository: Repository<Wallet>;

  constructor() {
    this.repository = AppDataSource.getRepository(Wallet);
  }

  async create(wallet: Partial<Wallet>): Promise<Wallet> {
    const newWallet = this.repository.create(wallet);
    return await this.repository.save(newWallet);
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return await this.repository.findOne({ where: { userId } });
  }

  async update(id: string, data: Partial<Wallet>): Promise<Wallet | null> {
    const wallet = await this.repository.findOne({ where: { id } });
    if (!wallet) return null;
    Object.assign(wallet, data);
    return await this.repository.save(wallet);
  }
}
