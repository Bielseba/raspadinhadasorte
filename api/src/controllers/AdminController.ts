import { Request, Response } from 'express';
import { WalletRepository } from '../repositories/WalletRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ResponseHelper } from '../utils/responseHelpers';
import { UserRole } from '../entities/User';

export class AdminController {
  constructor(
    private walletRepository: WalletRepository,
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository
  ) { }

  // Admin: Ver todas as transações do sistema
  async getAllTransactions(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, userId, type, startDate, endDate } = req.query;
      
      const transactions = await this.transactionRepository.findAllWithFilters({
        page: Number(page),
        limit: Number(limit),
        userId: userId as string,
        type: type as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      });

      return ResponseHelper.success(res, transactions, 'Transações recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  // Admin: Ver transações de um usuário específico
  async getUserTransactions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      // Verificar se o usuário existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseHelper.notFound(res, 'Usuário não encontrado');
      }

      const transactions = await this.transactionRepository.findByUserIdWithPagination(
        userId,
        Number(page),
        Number(limit)
      );

      return ResponseHelper.success(res, transactions, 'Transações do usuário recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  // Admin: Depositar dinheiro na carteira de um usuário
  async depositToUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { amount, description } = req.body;

      if (!amount || amount <= 0) {
        return ResponseHelper.error(res, 'Valor inválido para depósito');
      }

      // Verificar se o usuário existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseHelper.notFound(res, 'Usuário não encontrado');
      }

      // Buscar ou criar carteira do usuário
      let wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) {
        wallet = await this.walletRepository.create({
          userId,
          balance: 0
        });
      }

      // Atualizar saldo
      const newBalance = Number(wallet.balance) + Number(amount);
      await this.walletRepository.update(wallet.id, { balance: newBalance });

      // Criar transação
      await this.transactionRepository.create({
        userId,
        amount: Number(amount),
        type: 'deposit',
        description: description || 'Depósito administrativo',
        adminId: (req as any).user?.id
      });

      return ResponseHelper.success(
        res, 
        { 
          userId, 
          newBalance, 
          amount,
          message: `Depósito de R$ ${amount} realizado com sucesso para ${user.name}`
        }, 
        'Depósito realizado com sucesso'
      );
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  // Admin: Ver saldo de todos os usuários
  async getAllWallets(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const wallets = await this.walletRepository.findAllWithUserInfo(
        Number(page),
        Number(limit)
      );

      return ResponseHelper.success(res, wallets, 'Carteiras recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  // Admin: Ver estatísticas gerais do sistema
  async getSystemStats(req: Request, res: Response) {
    try {
      const stats = await this.transactionRepository.getSystemStats();
      
      return ResponseHelper.success(res, stats, 'Estatísticas do sistema recuperadas com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }

  // Admin: Reverter transação (apenas depósitos)
  async reverseTransaction(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const { reason } = req.body;

      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) {
        return ResponseHelper.notFound(res, 'Transação não encontrada');
      }

      if (transaction.type !== 'deposit') {
        return ResponseHelper.error(res, 'Apenas depósitos podem ser revertidos');
      }

      // Buscar carteira do usuário
      const wallet = await this.walletRepository.findByUserId(transaction.userId);
      if (!wallet) {
        return ResponseHelper.notFound(res, 'Carteira do usuário não encontrada');
      }

      // Verificar se há saldo suficiente para reverter
      if (Number(wallet.balance) < Number(transaction.amount)) {
        return ResponseHelper.error(res, 'Saldo insuficiente para reverter a transação');
      }

      // Atualizar saldo
      const newBalance = Number(wallet.balance) - Number(transaction.amount);
      await this.walletRepository.update(wallet.id, { balance: newBalance });

      // Criar transação de reversão
      await this.transactionRepository.create({
        userId: transaction.userId,
        amount: Number(transaction.amount),
        type: 'withdrawal',
        description: `Reversão de depósito: ${reason || 'Reversão administrativa'}`,
        adminId: (req as any).user?.id,
        relatedTransactionId: transactionId
      });

      return ResponseHelper.success(
        res,
        {
          transactionId,
          reversedAmount: transaction.amount,
          newBalance,
          message: 'Transação revertida com sucesso'
        },
        'Transação revertida com sucesso'
      );
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  }
}
