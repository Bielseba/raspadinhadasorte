import { BaseEntity } from './Base';

export enum RaspadinhaStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired'
}

export enum PrizeType {
  MONEY = 'money',
  PRODUCT = 'product',
  DISCOUNT = 'discount'
}

export interface IPrize {
  id: string;
  type: PrizeType;
  name: string;
  value: number;
  image?: string;
  probability: number; // Probabilidade de 0 a 100
}

export class Raspadinha extends BaseEntity {
  public title: string;
  public description: string;
  public image: string;
  public price: number;
  public totalCards: number;
  public availableCards: number;
  public prizes: IPrize[];
  public status: RaspadinhaStatus;
  public expiresAt?: Date;

  constructor(data: {
    title: string;
    description: string;
    image: string;
    price: number;
    totalCards: number;
    prizes: IPrize[];
    expiresAt?: Date;
  }) {
    super();
    this.title = data.title;
    this.description = data.description;
    this.image = data.image;
    this.price = data.price;
    this.totalCards = data.totalCards;
    this.availableCards = data.totalCards;
    this.prizes = data.prizes;
    this.status = RaspadinhaStatus.ACTIVE;
    this.expiresAt = data.expiresAt;
  }

  public isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  public isSoldOut(): boolean {
    return this.availableCards <= 0;
  }

  public canBePurchased(): boolean {
    return this.status === RaspadinhaStatus.ACTIVE && 
           !this.isExpired() && 
           !this.isSoldOut();
  }

  public decreaseAvailableCards(): void {
    if (this.availableCards > 0) {
      this.availableCards--;
      this.updateTimestamp();
    }
  }
} 