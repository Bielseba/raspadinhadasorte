export abstract class BaseEntity {
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id?: string) {
    this.id = id || this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }
} 