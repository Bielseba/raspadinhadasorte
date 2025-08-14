import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Purchase } from './Purchase';

export enum RaspadinhaStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  SCRATCHED = 'scratched'
}

export enum RaspadinhaType {
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

@Entity('raspadinhas')
export class Raspadinha {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({
    type: 'enum',
    enum: RaspadinhaType,
    default: RaspadinhaType.SILVER
  })
  type!: RaspadinhaType;

  @Column({
    type: 'enum',
    enum: RaspadinhaStatus,
    default: RaspadinhaStatus.AVAILABLE
  })
  status!: RaspadinhaStatus;

  @Column({ type: 'int', default: 0 })
  maxWinnings!: number;

  @Column({ type: 'int', default: 0 })
  currentWinnings!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Purchase, purchase => purchase.raspadinha)
  purchases!: Purchase[];

  @Column({ type: 'int', default: 0 })
  availableCards!: number;

  constructor(data?: {
    name: string;
    description?: string;
    price: number;
    type?: RaspadinhaType;
    maxWinnings?: number;
  }) {
    if (data) {
      this.name = data.name;
      this.description = data.description;
      this.price = data.price;
      this.type = data.type || RaspadinhaType.SILVER;
      this.maxWinnings = data.maxWinnings || 0;
      this.currentWinnings = 0;
      this.status = RaspadinhaStatus.AVAILABLE;
      this.isActive = true;
    }
  }

  public markAsSold(): void {
    this.status = RaspadinhaStatus.SOLD;
  }

  public markAsScratched(): void {
    this.status = RaspadinhaStatus.SCRATCHED;
  }

  public setWinnings(amount: number): void {
    this.currentWinnings = amount;
  }

  public canBePurchased(): boolean {
    return this.isActive && this.status === RaspadinhaStatus.AVAILABLE && this.availableCards > 0;
  }

  public decreaseAvailableCards(): void {
    if (this.availableCards > 0) {
      this.availableCards -= 1;
    }
  }

} 