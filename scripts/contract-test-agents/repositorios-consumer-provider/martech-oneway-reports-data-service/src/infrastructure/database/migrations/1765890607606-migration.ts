import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765890607606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Set search_path to the schema configured in typeorm.config.ts
    const schema = (queryRunner.connection.options as any).schema || "public";
    await queryRunner.query(`SET search_path TO ${schema}`);

    // Add new columns to tlh_kpis_agg table
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le double precision;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le_ly double precision;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le_vs_ly double precision;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le_vs_bu double precision;",
    );

    // Add new columns to tlh_kpis_agg_shadow table
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le double precision;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le_ly double precision;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le_vs_ly double precision;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le_vs_bu double precision;",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Set search_path to the schema configured in typeorm.config.ts
    const schema = (queryRunner.connection.options as any).schema || "public";
    await queryRunner.query(`SET search_path TO ${schema}`);

    // Remove columns from tlh_kpis_agg_shadow table
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le_vs_bu;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le_vs_ly;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le_ly;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le;",
    );

    // Remove columns from tlh_kpis_agg table
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le_vs_bu;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le_vs_ly;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le_ly;",
    );
    await queryRunner.query(
      "ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le;",
    );
  }
}
