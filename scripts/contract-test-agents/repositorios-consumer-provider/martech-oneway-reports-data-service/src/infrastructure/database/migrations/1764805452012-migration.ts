import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "fs";
import * as path from "path";

export class Migration1764805452012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Set search_path to the schema configured in typeorm.config.ts
    const schema = (queryRunner.connection.options as any).schema || "public";
    await queryRunner.query(`SET search_path TO ${schema}`);

    const sqlBasePath = path.join(
      process.cwd(),
      "src/infrastructure/database/sql",
    );
    const tablesPath = path.join(sqlBasePath, "tables");
    const proceduresPath = path.join(sqlBasePath, "stored_procedures");

    // Create tables
    await queryRunner.query(
      fs.readFileSync(
        path.join(tablesPath, "create_table_tlh_kpis_agg_logs.sql"),
        "utf8",
      ),
    );
    await queryRunner.query(
      fs.readFileSync(
        path.join(tablesPath, "create_table_tlh_kpis_agg.sql"),
        "utf8",
      ),
    );
    await queryRunner.query(
      fs.readFileSync(
        path.join(tablesPath, "create_table_tlh_kpis_agg_shadow.sql"),
        "utf8",
      ),
    );

    // Create stored procedures
    await queryRunner.query(
      fs.readFileSync(
        path.join(
          proceduresPath,
          "sp_create_tlh_kpis_agg_shadow_partition_indexes.sql",
        ),
        "utf8",
      ),
    );
    await queryRunner.query(
      fs.readFileSync(
        path.join(proceduresPath, "sp_replace_tlh_kpis_agg_partition.sql"),
        "utf8",
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Set search_path to the schema configured in typeorm.config.ts
    const schema = (queryRunner.connection.options as any).schema || "public";
    await queryRunner.query(`SET search_path TO ${schema}`);

    // Drop all stored procedures
    await queryRunner.query(
      "DROP PROCEDURE IF EXISTS sp_replace_tlh_kpis_agg_partition CASCADE;",
    );
    await queryRunner.query(
      "DROP PROCEDURE IF EXISTS sp_create_tlh_kpis_agg_shadow_partition_indexes CASCADE;",
    );

    // Drop all tables
    await queryRunner.query(
      "DROP TABLE IF EXISTS tlh_kpis_agg_shadow CASCADE;",
    );
    await queryRunner.query("DROP TABLE IF EXISTS tlh_kpis_agg CASCADE;");
    await queryRunner.query("DROP TABLE IF EXISTS tlh_kpis_agg_logs CASCADE;");
  }
}
