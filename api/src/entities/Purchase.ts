import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Raspadinha } from './Raspadinha';

export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  raspadinhaId!: string;

  @Column({ 
    type: 'enum', 
    enum: PurchaseStatus, 
    default: PurchaseStatus.PENDING 
  })
  status!: PurchaseStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'int', default: 0 })
  winnings!: number;

  @Column({ type: 'boolean', default: false })
  isScratched!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  scratchedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.purchases)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Raspadinha, raspadinha => raspadinha.purchases)
  @JoinColumn({ name: 'raspadinhaId' })
  raspadinha!: Raspadinha;

  constructor(data?: {
    userId: string;
    raspadinhaId: string;
    amount: number;
  }) {
    if (data) {
      this.userId = data.userId;
      this.raspadinhaId = data.raspadinhaId;
      this.amount = data.amount;
      this.status = PurchaseStatus.PENDING;
      this.winnings = 0;
      this.isScratched = false;
    }
  }

  public complete(): void {
    this.status = PurchaseStatus.COMPLETED;
  }

  public cancel(): void {
    this.status = PurchaseStatus.CANCELLED;
  }

  public scratch(winnings: number): void {
    this.isScratched = true;
    this.winnings = winnings;
    this.scratchedAt = new Date();
    this.status = PurchaseStatus.COMPLETED;
  }
} 