import { IRepository } from '../interfaces/IRepository';
import { BaseEntity } from '../entities/Base';

export class InMemoryRepository<T extends BaseEntity> implements IRepository<T> {
  protected data: T[] = [];

  async findAll(): Promise<T[]> {
    return [...this.data];
  }

  async findById(id: string): Promise<T | null> {
    const item = this.data.find(item => item.id === id);
    return item || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const item = data as T;
    this.data.push(item);
    return item;
  }

  async update(id: string, updateData: Partial<T>): Promise<T | null> {
    const itemIndex = this.data.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return null;
    }

    const existingItem = this.data[itemIndex];
    const updatedItem = { ...existingItem, ...updateData };
    updatedItem.updateTimestamp();
    
    this.data[itemIndex] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.data.length;
    this.data = this.data.filter(item => item.id !== id);
    return this.data.length < initialLength;
  }

  // Métodos auxiliares específicos do repositório em memória
  protected findByField<K extends keyof T>(field: K, value: T[K]): T | null {
    return this.data.find(item => item[field] === value) || null;
  }

  protected findManyByField<K extends keyof T>(field: K, value: T[K]): T[] {
    return this.data.filter(item => item[field] === value);
  }
} 