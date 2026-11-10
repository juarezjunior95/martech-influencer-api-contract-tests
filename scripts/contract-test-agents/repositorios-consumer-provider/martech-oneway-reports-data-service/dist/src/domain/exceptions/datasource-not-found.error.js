"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasourceNotFoundError = void 0;
const common_1 = require("@nestjs/common");
class DatasourceNotFoundError extends common_1.NotFoundException {
    constructor(datasourceName) {
        super(`Datasource '${datasourceName}' not found`);
        this.name = "DatasourceNotFoundError";
    }
}
exports.DatasourceNotFoundError = DatasourceNotFoundError;
//# sourceMappingURL=datasource-not-found.error.js.map