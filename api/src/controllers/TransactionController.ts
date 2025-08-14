import { Request, Response } from 'express';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { ResponseHelper } from '../utils/responseHelpers';

export class TransactionController {
    constructor(private transactionRepository: TransactionRepository) { }

    // Usuário: Ver últimas transações (mantido para compatibilidade)
    getLastTransactions = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { limit = 10 } = req.query;
            
            const transactions = await this.transactionRepository.findByUserId(userId, Number(limit));
            
            return ResponseHelper.success(res, transactions, "Transações encontradas");
        } catch (err: any) {
            return ResponseHelper.error(res, err.message);
        }
    };

    // Usuário: Ver transação específica
    getTransaction = async (req: Request, res: Response) => {
        try {
            const { transactionId } = req.params;
            const { userId } = req.query;

            // Verificar se o usuário está tentando ver sua própria transação
            const authenticatedUserId = (req as any).user?.id;
            if (authenticatedUserId !== userId) {
                return ResponseHelper.forbidden(res, 'Você só pode ver suas próprias transações');
            }

            const transaction = await this.transactionRepository.findById(transactionId);
            if (!transaction) {
                return ResponseHelper.notFound(res, 'Transação não encontrada');
            }

            if (transaction.userId !== userId) {
                return ResponseHelper.forbidden(res, 'Você só pode ver suas próprias transações');
            }

            return ResponseHelper.success(res, transaction, 'Transação encontrada');
        } catch (err: any) {
            return ResponseHelper.error(res, err.message);
        }
    };

    // Usuário: Exportar transações (CSV)
    exportTransactions = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { format = 'csv', startDate, endDate } = req.query;

            // Verificar se o usuário está tentando exportar suas próprias transações
            const authenticatedUserId = (req as any).user?.id;
            if (authenticatedUserId !== userId) {
                return ResponseHelper.forbidden(res, 'Você só pode exportar suas próprias transações');
            }

            if (format !== 'csv') {
                return ResponseHelper.error(res, 'Formato de exportação não suportado. Use CSV.');
            }

            const transactions = await this.transactionRepository.findByUserIdWithFilters(
                userId,
                {
                    startDate: startDate ? new Date(startDate as string) : undefined,
                    endDate: endDate ? new Date(endDate as string) : undefined
                }
            );

            // Gerar CSV
            const csvData = this.generateCSV(transactions.data);
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=transactions-${userId}-${new Date().toISOString().split('T')[0]}.csv`);
            
            return res.send(csvData);
        } catch (err: any) {
            return ResponseHelper.error(res, err.message);
        }
    };

    // Usuário: Ver resumo mensal
    getMonthlySummary = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { year, month } = req.query;

            // Verificar se o usuário está tentando ver seu próprio resumo
            const authenticatedUserId = (req as any).user?.id;
            if (authenticatedUserId !== userId) {
                return ResponseHelper.forbidden(res, 'Você só pode ver seu próprio resumo');
            }

            const summary = await this.transactionRepository.getMonthlySummary(
                userId,
                Number(year) || new Date().getFullYear(),
                Number(month) || new Date().getMonth() + 1
            );

            return ResponseHelper.success(res, summary, 'Resumo mensal recuperado');
        } catch (err: any) {
            return ResponseHelper.error(res, err.message);
        }
    };

    // Usuário: Ver categorias de transações
    getTransactionCategories = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            // Verificar se o usuário está tentando ver suas próprias categorias
            const authenticatedUserId = (req as any).user?.id;
            if (authenticatedUserId !== userId) {
                return ResponseHelper.forbidden(res, 'Você só pode ver suas próprias categorias');
            }

            const categories = await this.transactionRepository.getTransactionCategories(userId);

            return ResponseHelper.success(res, categories, 'Categorias de transações recuperadas');
        } catch (err: any) {
            return ResponseHelper.error(res, err.message);
        }
    };

    // Método auxiliar para gerar CSV
    private generateCSV(transactions: any[]): string {
        const headers = ['Data', 'Tipo', 'Valor', 'Descrição', 'Saldo Anterior', 'Saldo Posterior'];
        const csvRows = [headers.join(',')];

        for (const transaction of transactions) {
            const row = [
                new Date(transaction.date).toLocaleDateString('pt-BR'),
                transaction.type === 'deposit' ? 'Depósito' : 'Saque',
                `R$ ${Number(transaction.amount).toFixed(2)}`,
                transaction.description || '',
                transaction.previousBalance ? `R$ ${Number(transaction.previousBalance).toFixed(2)}` : '',
                transaction.newBalance ? `R$ ${Number(transaction.newBalance).toFixed(2)}` : ''
            ];
            csvRows.push(row.join(','));
        }

        return csvRows.join('\n');
    }
}
