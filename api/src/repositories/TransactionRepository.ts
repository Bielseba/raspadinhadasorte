import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  findByUserId(userId: string, limit?: number): Promise<Transaction[]>;
}

export class TransactionRepository implements ITransactionRepository {
  private repository: Repository<Transaction>;

  constructor() {
    this.repository = AppDataSource.getRepository(Transaction);
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.repository.create(transaction);
    return await this.repository.save(newTransaction);
  }

  async findByUserId(userId: string, limit = 10): Promise<Transaction[]> {
    return await this.repository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: limit
    });
  }
}