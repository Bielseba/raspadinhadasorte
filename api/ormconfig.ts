import { DataSource } from 'typeorm';
import { User } from './src/entities/User';
import { Raspadinha } from './src/entities/Raspadinha';
import { Purchase } from './src/entities/Purchase';
import { Wallet } from './src/entities/Wallet';
import { Transaction } from './src/entities/Transaction';
import dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'raspadinhadasorte',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Raspadinha, Purchase, Wallet, Transaction],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
}); 