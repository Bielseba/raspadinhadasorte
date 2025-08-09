import { BaseEntity } from './Base';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export class User extends BaseEntity {
  public name: string;
  public email: string;
  public password: string;
  public role: UserRole;
  public isActive: boolean;

  constructor(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    super();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || UserRole.USER;
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
    this.updateTimestamp();
  }

  public activate(): void {
    this.isActive = true;
    this.updateTimestamp();
  }
} 