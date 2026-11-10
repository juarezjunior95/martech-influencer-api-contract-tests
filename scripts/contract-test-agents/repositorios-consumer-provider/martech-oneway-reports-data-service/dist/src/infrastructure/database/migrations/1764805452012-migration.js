"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1764805452012 = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Migration1764805452012 {
    async up(queryRunner) {
        const schema = queryRunner.connection.options.schema || "public";
        await queryRunner.query(`SET search_path TO ${schema}`);
        const sqlBasePath = path.join(process.cwd(), "src/infrastructure/database/sql");
        const tablesPath = path.join(sqlBasePath, "tables");
        const proceduresPath = path.join(sqlBasePath, "stored_procedures");
        await queryRunner.query(fs.readFileSync(path.join(tablesPath, "create_table_tlh_kpis_agg_logs.sql"), "utf8"));
        await queryRunner.query(fs.readFileSync(path.join(tablesPath, "create_table_tlh_kpis_agg.sql"), "utf8"));
        await queryRunner.query(fs.readFileSync(path.join(tablesPath, "create_table_tlh_kpis_agg_shadow.sql"), "utf8"));
        await queryRunner.query(fs.readFileSync(path.join(proceduresPath, "sp_create_tlh_kpis_agg_shadow_partition_indexes.sql"), "utf8"));
        await queryRunner.query(fs.readFileSync(path.join(proceduresPath, "sp_replace_tlh_kpis_agg_partition.sql"), "utf8"));
    }
    async down(queryRunner) {
        const schema = queryRunner.connection.options.schema || "public";
        await queryRunner.query(`SET search_path TO ${schema}`);
        await queryRunner.query("DROP PROCEDURE IF EXISTS sp_replace_tlh_kpis_agg_partition CASCADE;");
        await queryRunner.query("DROP PROCEDURE IF EXISTS sp_create_tlh_kpis_agg_shadow_partition_indexes CASCADE;");
        await queryRunner.query("DROP TABLE IF EXISTS tlh_kpis_agg_shadow CASCADE;");
        await queryRunner.query("DROP TABLE IF EXISTS tlh_kpis_agg CASCADE;");
        await queryRunner.query("DROP TABLE IF EXISTS tlh_kpis_agg_logs CASCADE;");
    }
}
exports.Migration1764805452012 = Migration1764805452012;
//# sourceMappingURL=1764805452012-migration.js.map