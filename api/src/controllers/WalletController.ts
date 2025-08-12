import { Request, Response } from 'express';
import { WalletRepository } from '../repositories/WalletRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { ResponseHelper } from '../utils/responseHelpers';

export class WalletController {
  constructor(
    private walletRepository: WalletRepository,
    private transactionRepository: TransactionRepository
  ) { }

  async getBalance(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const wallet = await this.walletRepository.findByUserId(userId);

      if (!wallet) return ResponseHelper.notFound(res, 'Carteira não encontrada');

      return ResponseHelper.success(res, { balance: wallet.balance }, 'Carteira recuperada');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };

  async deposit(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { amount } = req.body;
      if (amount <= 0) return res.status(400).json({ message: 'Valor inválido' });

      const wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) return res.status(404).json({ message: 'Carteira não encontrada' });

      wallet.balance += amount;
      await this.walletRepository.update(wallet.id, { balance: wallet.balance });
      await this.transactionRepository.create({ userId, amount, type: 'deposit' });


      return ResponseHelper.success(res, { balance: wallet.balance }, 'Depósito realizado com sucesso');
    } catch (error: any) {
      return ResponseHelper.serverError(res, error.message);
    }
  };
}