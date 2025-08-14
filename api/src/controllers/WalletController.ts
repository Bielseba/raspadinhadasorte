import { Request, Response } from 'express';
import { WalletRepository } from '../repositories/WalletRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { ResponseHelper } from '../utils/responseHelpers';

export class WalletController {
  constructor(
    private walletRepository: WalletRepository,
    private transactionRepository: TransactionRepository
  ) { }

  // Usuário: Ver saldo da própria carteira
  async getBalance(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const wallet = await this.walletRepository.findByUserId(userId);

      if (!wallet) {
        // Criar carteira se não existir
        const newWallet = await this.walletRepository.create({
          userId,
          balance: 0
        });
        return ResponseHelper.success(res, { balance: newWallet.balance }, 'Carteira criada e saldo recuperado');
      }

      return ResponseHelper.success(res, { balance: wallet.balance }, 'Saldo da carteira recuperado');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };

  // Usuário: Depositar dinheiro na própria carteira
  async deposit(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { amount, description } = req.body;
      
      if (!amount || amount <= 0) {
        return ResponseHelper.error(res, 'Valor inválido para depósito');
      }

      // Verificar se o usuário está tentando depositar em sua própria carteira
      const authenticatedUserId = (req as any).user?.id;
      if (authenticatedUserId !== userId) {
        return ResponseHelper.forbidden(res, 'Você só pode depositar em sua própria carteira');
      }

      let wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) {
        wallet = await this.walletRepository.create({
          userId,
          balance: 0
        });
      }

      const newBalance = Number(wallet.balance) + Number(amount);
      await this.walletRepository.update(wallet.id, { balance: newBalance });
      
      // Criar transação
      await this.transactionRepository.create({
        userId,
        amount: Number(amount),
        type: 'deposit',
        description: description || 'Depósito pessoal'
      });

      return ResponseHelper.success(
        res, 
        { 
          balance: newBalance, 
          amount,
          message: `Depósito de R$ ${amount} realizado com sucesso`
        }, 
        'Depósito realizado com sucesso'
      );
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };

  // Usuário: Sacar dinheiro da própria carteira
  async withdraw(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { amount, description } = req.body;
      
      if (!amount || amount <= 0) {
        return ResponseHelper.error(res, 'Valor inválido para saque');
      }

      // Verificar se o usuário está tentando sacar de sua própria carteira
      const authenticatedUserId = (req as any).user?.id;
      if (authenticatedUserId !== userId) {
        return ResponseHelper.forbidden(res, 'Você só pode sacar de sua própria carteira');
      }

      const wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) {
        return ResponseHelper.notFound(res, 'Carteira não encontrada');
      }

      if (Number(wallet.balance) < Number(amount)) {
        return ResponseHelper.error(res, 'Saldo insuficiente para realizar o saque');
      }

      const newBalance = Number(wallet.balance) - Number(amount);
      await this.walletRepository.update(wallet.id, { balance: newBalance });
      
      // Criar transação
      await this.transactionRepository.create({
        userId,
        amount: Number(amount),
        type: 'withdrawal',
        description: description || 'Saque pessoal'
      });

      return ResponseHelper.success(
        res, 
        { 
          balance: newBalance, 
          amount,
          message: `Saque de R$ ${amount} realizado com sucesso`
        }, 
        'Saque realizado com sucesso'
      );
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };

  // Usuário: Ver histórico completo de transações
  async getTransactionHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, type, startDate, endDate } = req.query;

      // Verificar se o usuário está tentando ver suas próprias transações
      const authenticatedUserId = (req as any).user?.id;
      if (authenticatedUserId !== userId) {
        return ResponseHelper.forbidden(res, 'Você só pode ver suas próprias transações');
      }

      const transactions = await this.transactionRepository.findByUserIdWithFilters(
        userId,
        {
          page: Number(page),
          limit: Number(limit),
          type: type as string,
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined
        }
      );

      return ResponseHelper.success(res, transactions, 'Histórico de transações recuperado');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };

  // Usuário: Ver estatísticas pessoais
  async getPersonalStats(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Verificar se o usuário está tentando ver suas próprias estatísticas
      const authenticatedUserId = (req as any).user?.id;
      if (authenticatedUserId !== userId) {
        return ResponseHelper.forbidden(res, 'Você só pode ver suas próprias estatísticas');
      }

      const stats = await this.transactionRepository.getUserStats(userId);
      const wallet = await this.walletRepository.findByUserId(userId);
      
      const personalStats = {
        currentBalance: wallet?.balance || 0,
        totalDeposits: stats.totalDeposits || 0,
        totalWithdrawals: stats.totalWithdrawals || 0,
        totalTransactions: stats.totalTransactions || 0,
        lastTransaction: stats.lastTransaction
      };

      return ResponseHelper.success(res, personalStats, 'Estatísticas pessoais recuperadas');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };

  // Usuário: Transferir dinheiro para outro usuário
  async transfer(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { targetUserId, amount, description } = req.body;
      
      if (!amount || amount <= 0) {
        return ResponseHelper.error(res, 'Valor inválido para transferência');
      }

      if (!targetUserId || targetUserId === userId) {
        return ResponseHelper.error(res, 'Usuário de destino inválido');
      }

      // Verificar se o usuário está tentando transferir de sua própria carteira
      const authenticatedUserId = (req as any).user?.id;
      if (authenticatedUserId !== userId) {
        return ResponseHelper.forbidden(res, 'Você só pode transferir de sua própria carteira');
      }

      // Buscar carteira do usuário origem
      const sourceWallet = await this.walletRepository.findByUserId(userId);
      if (!sourceWallet) {
        return ResponseHelper.notFound(res, 'Carteira de origem não encontrada');
      }

      if (Number(sourceWallet.balance) < Number(amount)) {
        return ResponseHelper.error(res, 'Saldo insuficiente para realizar a transferência');
      }

      // Buscar ou criar carteira do usuário destino
      let targetWallet = await this.walletRepository.findByUserId(targetUserId);
      if (!targetWallet) {
        targetWallet = await this.walletRepository.create({
          userId: targetUserId,
          balance: 0
        });
      }

      // Atualizar saldos
      const sourceNewBalance = Number(sourceWallet.balance) - Number(amount);
      const targetNewBalance = Number(targetWallet.balance) + Number(amount);

      await this.walletRepository.update(sourceWallet.id, { balance: sourceNewBalance });
      await this.walletRepository.update(targetWallet.id, { balance: targetNewBalance });
      
      // Criar transações
      await this.transactionRepository.create({
        userId,
        amount: Number(amount),
        type: 'withdrawal',
        description: `Transferência para usuário ${targetUserId}: ${description || 'Transferência'}`,
        relatedUserId: targetUserId
      });

      await this.transactionRepository.create({
        userId: targetUserId,
        amount: Number(amount),
        type: 'deposit',
        description: `Transferência recebida de usuário ${userId}: ${description || 'Transferência'}`,
        relatedUserId: userId
      });

      return ResponseHelper.success(
        res, 
        { 
          sourceBalance: sourceNewBalance,
          targetBalance: targetNewBalance,
          amount,
          message: `Transferência de R$ ${amount} realizada com sucesso`
        }, 
        'Transferência realizada com sucesso'
      );
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };
}