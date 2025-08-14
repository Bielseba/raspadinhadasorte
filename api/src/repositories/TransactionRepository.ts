import { Repository, Between, Like, In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Transaction, TransactionType } from '../entities/Transaction';

export interface ITransactionRepository {
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  findByUserId(userId: string, limit?: number): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  findByUserIdWithPagination(userId: string, page: number, limit: number): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  findByUserIdWithFilters(userId: string, filters: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  findAllWithFilters(filters: {
    page: number;
    limit: number;
    userId?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getUserStats(userId: string): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalTransactions: number;
    lastTransaction: Transaction | null;
  }>;
  getMonthlySummary(userId: string, year: number, month: number): Promise<{
    month: string;
    totalDeposits: number;
    totalWithdrawals: number;
    netAmount: number;
    transactionCount: number;
  }>;
  getTransactionCategories(userId: string): Promise<{
    type: TransactionType;
    count: number;
    totalAmount: number;
  }[]>;
  getSystemStats(): Promise<{
    totalTransactions: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalAmount: number;
    averageTransactionAmount: number;
    transactionsToday: number;
    transactionsThisMonth: number;
  }>;
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

  async findById(id: string): Promise<Transaction | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserIdWithPagination(
    userId: string, 
    page: number, 
    limit: number
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [data, total] = await this.repository.findAndCount({
      where: { userId },
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByUserIdWithFilters(
    userId: string, 
    filters: {
      page?: number;
      limit?: number;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 20, type, startDate, endDate } = filters;
    
    const whereConditions: any = { userId };
    
    if (type) {
      whereConditions.type = type;
    }
    
    if (startDate && endDate) {
      whereConditions.date = Between(startDate, endDate);
    } else if (startDate) {
      whereConditions.date = Between(startDate, new Date());
    } else if (endDate) {
      whereConditions.date = Between(new Date(0), endDate);
    }

    const [data, total] = await this.repository.findAndCount({
      where: whereConditions,
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findAllWithFilters(filters: {
    page: number;
    limit: number;
    userId?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, userId, type, startDate, endDate } = filters;
    
    const whereConditions: any = {};
    
    if (userId) {
      whereConditions.userId = userId;
    }
    
    if (type) {
      whereConditions.type = type;
    }
    
    if (startDate && endDate) {
      whereConditions.date = Between(startDate, endDate);
    } else if (startDate) {
      whereConditions.date = Between(startDate, new Date());
    } else if (endDate) {
      whereConditions.date = Between(new Date(0), endDate);
    }

    const [data, total] = await this.repository.findAndCount({
      where: whereConditions,
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user']
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserStats(userId: string): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalTransactions: number;
    lastTransaction: Transaction | null;
  }> {
    const [deposits, withdrawals, total, lastTransaction] = await Promise.all([
      this.repository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.userId = :userId AND transaction.type = :type', { 
          userId, 
          type: 'deposit' 
        })
        .getRawOne(),
      
      this.repository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.userId = :userId AND transaction.type = :type', { 
          userId, 
          type: 'withdrawal' 
        })
        .getRawOne(),
      
      this.repository.count({ where: { userId } }),
      
      this.repository.findOne({
        where: { userId },
        order: { date: 'DESC' }
      })
    ]);

    return {
      totalDeposits: Number(deposits?.total || 0),
      totalWithdrawals: Number(withdrawals?.total || 0),
      totalTransactions: total,
      lastTransaction
    };
  }

  async getMonthlySummary(
    userId: string, 
    year: number, 
    month: number
  ): Promise<{
    month: string;
    totalDeposits: number;
    totalWithdrawals: number;
    netAmount: number;
    transactionCount: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [deposits, withdrawals, count] = await Promise.all([
      this.repository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.userId = :userId AND transaction.type = :type AND transaction.date BETWEEN :startDate AND :endDate', {
          userId,
          type: 'deposit',
          startDate,
          endDate
        })
        .getRawOne(),
      
      this.repository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.userId = :userId AND transaction.type = :type AND transaction.date BETWEEN :startDate AND :endDate', {
          userId,
          type: 'withdrawal',
          startDate,
          endDate
        })
        .getRawOne(),
      
      this.repository.count({
        where: {
          userId,
          date: Between(startDate, endDate)
        }
      })
    ]);

    const totalDeposits = Number(deposits?.total || 0);
    const totalWithdrawals = Number(withdrawals?.total || 0);

    return {
      month: `${year}-${month.toString().padStart(2, '0')}`,
      totalDeposits,
      totalWithdrawals,
      netAmount: totalDeposits - totalWithdrawals,
      transactionCount: count
    };
  }

  async getTransactionCategories(userId: string): Promise<{
    type: TransactionType;
    count: number;
    totalAmount: number;
  }[]> {
    const categories = await this.repository
      .createQueryBuilder('transaction')
      .select('transaction.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .where('transaction.userId = :userId', { userId })
      .groupBy('transaction.type')
      .getRawMany();

    return categories.map(cat => ({
      type: cat.type,
      count: Number(cat.count),
      totalAmount: Number(cat.totalAmount)
    }));
  }

  async getSystemStats(): Promise<{
    totalTransactions: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalAmount: number;
    averageTransactionAmount: number;
    transactionsToday: number;
    transactionsThisMonth: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const [
      totalTransactions,
      deposits,
      withdrawals,
      todayCount,
      monthCount
    ] = await Promise.all([
      this.repository.count(),
      
      this.repository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.type = :type', { type: 'deposit' })
        .getRawOne(),
      
      this.repository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.type = :type', { type: 'withdrawal' })
        .getRawOne(),
      
      this.repository.count({
        where: {
          date: Between(today, new Date())
        }
      }),
      
      this.repository.count({
        where: {
          date: Between(thisMonth, new Date())
        }
      })
    ]);

    const totalDeposits = Number(deposits?.total || 0);
    const totalWithdrawals = Number(withdrawals?.total || 0);
    const totalAmount = totalDeposits - totalWithdrawals;

    return {
      totalTransactions,
      totalDeposits,
      totalWithdrawals,
      totalAmount,
      averageTransactionAmount: totalTransactions > 0 ? totalAmount / totalTransactions : 0,
      transactionsToday: todayCount,
      transactionsThisMonth: monthCount
    };
  }
}