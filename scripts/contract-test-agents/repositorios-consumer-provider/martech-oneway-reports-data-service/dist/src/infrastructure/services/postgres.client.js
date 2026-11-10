"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PostgresClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresClient = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let PostgresClient = PostgresClient_1 = class PostgresClient {
    constructor(pool) {
        this.pool = pool;
        this.logger = new common_1.Logger(PostgresClient_1.name);
    }
    async executeQuery(query, parameters) {
        try {
            const result = await this.pool.query(query, parameters);
            return result.rows;
        }
        catch (error) {
            this.logger.error(`Query failed: ${error.message}`);
            throw error;
        }
    }
};
exports.PostgresClient = PostgresClient;
exports.PostgresClient = PostgresClient = PostgresClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("POSTGRES_POOL")),
    __metadata("design:paramtypes", [pg_1.Pool])
], PostgresClient);
//# sourceMappingURL=postgres.client.js.map