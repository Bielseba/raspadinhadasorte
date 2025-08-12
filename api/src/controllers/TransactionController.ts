import { Request, Response } from 'express';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { ResponseHelper } from '../utils/responseHelpers';

export class TransactionController {
    constructor(private transactionRepository: TransactionRepository) { }

    getLastTransactions = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const transactions = await this.transactionRepository.findByUserId(userId, 10);
            
            return ResponseHelper.success(res, transactions, "Transações encontradas");
        } catch (err: any) {
            return ResponseHelper.error(res, err.message);
        }
    };
}
