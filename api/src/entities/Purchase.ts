import { BaseEntity } from './Base';
import { IPrize } from './Raspadinha';

export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class Purchase extends BaseEntity {
  public userId: string;
  public raspadinhaId: string;
  public amount: number;
  public status: PurchaseStatus;
  public prize?: IPrize;
  public isScratched: boolean;
  public scratchedAt?: Date;

  constructor(data: {
    userId: string;
    raspadinhaId: string;
    amount: number;
  }) {
    super();
    this.userId = data.userId;
    this.raspadinhaId = data.raspadinhaId;
    this.amount = data.amount;
    this.status = PurchaseStatus.PENDING;
    this.isScratched = false;
  }

  public complete(prize?: IPrize): void {
    this.status = PurchaseStatus.COMPLETED;
    this.prize = prize;
    this.updateTimestamp();
  }

  public cancel(): void {
    this.status = PurchaseStatus.CANCELLED;
    this.updateTimestamp();
  }

  public scratch(prize?: IPrize): void {
    if (this.status === PurchaseStatus.COMPLETED && !this.isScratched) {
      this.isScratched = true;
      this.scratchedAt = new Date();
      this.prize = prize;
      this.updateTimestamp();
    }
  }
} 