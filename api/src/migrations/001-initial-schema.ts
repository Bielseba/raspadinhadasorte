import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para UserRole
    await queryRunner.query(`
      CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')
    `);

    // Criar enum para RaspadinhaType
    await queryRunner.query(`
      CREATE TYPE "public"."raspadinha_type_enum" AS ENUM('silver', 'gold', 'platinum')
    `);

    // Criar enum para RaspadinhaStatus
    await queryRunner.query(`
      CREATE TYPE "public"."raspadinha_status_enum" AS ENUM('available', 'sold', 'scratched')
    `);

    // Criar enum para PurchaseStatus
    await queryRunner.query(`
      CREATE TYPE "public"."purchase_status_enum" AS ENUM('pending', 'completed', 'cancelled')
    `);

    // Criar tabela users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "phone" character varying(255),
        "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Criar tabela raspadinhas
    await queryRunner.query(`
      CREATE TABLE "raspadinhas" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "price" decimal(10,2) NOT NULL,
        "type" "public"."raspadinha_type_enum" NOT NULL DEFAULT 'silver',
        "status" "public"."raspadinha_status_enum" NOT NULL DEFAULT 'available',
        "maxWinnings" integer NOT NULL DEFAULT '0',
        "currentWinnings" integer NOT NULL DEFAULT '0',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_raspadinhas_id" PRIMARY KEY ("id")
      )
    `);

    // Criar tabela purchases
    await queryRunner.query(`
      CREATE TABLE "purchases" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "raspadinhaId" uuid NOT NULL,
        "status" "public"."purchase_status_enum" NOT NULL DEFAULT 'pending',
        "amount" decimal(10,2) NOT NULL,
        "winnings" integer NOT NULL DEFAULT '0',
        "isScratched" boolean NOT NULL DEFAULT false,
        "scratchedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_purchases_id" PRIMARY KEY ("id")
      )
    `);

    // Criar índices
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_raspadinhas_status" ON "raspadinhas" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_raspadinhas_type" ON "raspadinhas" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_purchases_userId" ON "purchases" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_purchases_raspadinhaId" ON "purchases" ("raspadinhaId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_purchases_status" ON "purchases" ("status")
    `);

    // Criar foreign keys
    await queryRunner.query(`
      ALTER TABLE "purchases" 
      ADD CONSTRAINT "FK_purchases_userId" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "purchases" 
      ADD CONSTRAINT "FK_purchases_raspadinhaId" 
      FOREIGN KEY ("raspadinhaId") REFERENCES "raspadinhas"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Habilitar extensão uuid-ossp se não existir
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign keys
    await queryRunner.query(`
      ALTER TABLE "purchases" DROP CONSTRAINT "FK_purchases_raspadinhaId"
    `);

    await queryRunner.query(`
      ALTER TABLE "purchases" DROP CONSTRAINT "FK_purchases_userId"
    `);

    // Remover tabelas
    await queryRunner.query(`DROP TABLE "purchases"`);
    await queryRunner.query(`DROP TABLE "raspadinhas"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Remover enums
    await queryRunner.query(`DROP TYPE "public"."purchase_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."raspadinha_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."raspadinha_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
} 