import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Purchase } from './Purchase';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[];

  constructor(data?: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    if (data) {
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.role = data.role || UserRole.USER;
      this.isActive = true;
    }
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }
} 