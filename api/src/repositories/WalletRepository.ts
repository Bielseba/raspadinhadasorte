import { Repository, MoreThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Wallet } from '../entities/Wallet';

export interface IWalletRepository {
  create(wallet: Partial<Wallet>): Promise<Wallet>;
  findByUserId(userId: string): Promise<Wallet | null>;
  update(id: string, data: Partial<Wallet>): Promise<Wallet | null>;
  findAllWithUserInfo(page: number, limit: number): Promise<{
    data: (Wallet & { user: { id: string; name: string; email: string } })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getTotalBalance(): Promise<number>;
  getWalletStats(): Promise<{
    totalWallets: number;
    totalBalance: number;
    averageBalance: number;
    walletsWithBalance: number;
  }>;
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

  async findAllWithUserInfo(
    page: number, 
    limit: number
  ): Promise<{
    data: (Wallet & { user: { id: string; name: string; email: string } })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [data, total] = await this.repository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .select([
        'wallet.id',
        'wallet.balance',
        'wallet.userId',
        'user.id',
        'user.name',
        'user.email'
      ])
      .orderBy('wallet.balance', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: data as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getTotalBalance(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('wallet')
      .select('SUM(wallet.balance)', 'total')
      .getRawOne();
    
    return Number(result?.total || 0);
  }

  async getWalletStats(): Promise<{
    totalWallets: number;
    totalBalance: number;
    averageBalance: number;
    walletsWithBalance: number;
  }> {
    const [totalWallets, totalBalance, walletsWithBalance] = await Promise.all([
      this.repository.count(),
      this.getTotalBalance(),
      this.repository.count({ where: { balance: MoreThan(0) } })
    ]);

    return {
      totalWallets,
      totalBalance,
      averageBalance: totalWallets > 0 ? totalBalance / totalWallets : 0,
      walletsWithBalance
    };
  }
}
