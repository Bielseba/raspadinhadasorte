import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'refund';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar' })
  type: TransactionType;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  // Campo para identificar se foi uma transação administrativa
  @Column({ name: 'admin_id', nullable: true })
  adminId: string;

  // Campo para identificar usuário relacionado (ex: transferências)
  @Column({ name: 'related_user_id', nullable: true })
  relatedUserId: string;

  // Campo para identificar transação relacionada (ex: reversões)
  @Column({ name: 'related_transaction_id', nullable: true })
  relatedTransactionId: string;

  // Campo para saldo anterior (para auditoria)
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  previousBalance: number;

  // Campo para saldo posterior (para auditoria)
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  newBalance: number;

  // Campo para status da transação
  @Column({ type: 'varchar', length: 50, default: 'completed' })
  status: 'pending' | 'completed' | 'failed' | 'cancelled';

  // Campo para metadados adicionais (JSON)
  @Column({ type: 'json', nullable: true })
  metadata: any;

  constructor(partial?: Partial<Transaction>) {
    Object.assign(this, partial);
  }
}
