import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletAndTransactionTables1700000000001 implements MigrationInterface {
  name = 'AddWalletAndTransactionTables1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create wallets table
    await queryRunner.query(`
      CREATE TABLE "wallets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "balance" decimal(15,2) NOT NULL DEFAULT 0,
        CONSTRAINT "PK_wallets_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_wallets_user_id" UNIQUE ("user_id")
      )
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "description" varchar(500),
        "date" timestamp NOT NULL DEFAULT now(),
        "admin_id" uuid,
        "related_user_id" uuid,
        "related_transaction_id" uuid,
        "previous_balance" decimal(15,2),
        "new_balance" decimal(15,2),
        "status" varchar(50) NOT NULL DEFAULT 'completed',
        "metadata" json,
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id")
      )
    `);

    // Create foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "wallets" 
      ADD CONSTRAINT "FK_wallets_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "transactions" 
      ADD CONSTRAINT "FK_transactions_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_wallets_user_id" ON "wallets" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_user_id" ON "transactions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_type" ON "transactions" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_date" ON "transactions" ("date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_status" ON "transactions" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_user_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "wallets" DROP CONSTRAINT "FK_wallets_user_id"
    `);

    // Remove indexes
    await queryRunner.query(`DROP INDEX "IDX_transactions_status"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_date"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_type"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_wallets_user_id"`);

    // Remove tables
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "wallets"`);
  }
}
