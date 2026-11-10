"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1765890607606 = void 0;
class Migration1765890607606 {
    async up(queryRunner) {
        const schema = queryRunner.connection.options.schema || "public";
        await queryRunner.query(`SET search_path TO ${schema}`);
        await queryRunner.query("ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le double precision;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le_ly double precision;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le_vs_ly double precision;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg ADD COLUMN IF NOT EXISTS le_vs_bu double precision;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le double precision;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le_ly double precision;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le_vs_ly double precision;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow ADD COLUMN IF NOT EXISTS le_vs_bu double precision;");
    }
    async down(queryRunner) {
        const schema = queryRunner.connection.options.schema || "public";
        await queryRunner.query(`SET search_path TO ${schema}`);
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le_vs_bu;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le_vs_ly;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le_ly;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg_shadow DROP COLUMN IF EXISTS le;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le_vs_bu;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le_vs_ly;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le_ly;");
        await queryRunner.query("ALTER TABLE tlh_kpis_agg DROP COLUMN IF EXISTS le;");
    }
}
exports.Migration1765890607606 = Migration1765890607606;
//# sourceMappingURL=1765890607606-migration.js.map