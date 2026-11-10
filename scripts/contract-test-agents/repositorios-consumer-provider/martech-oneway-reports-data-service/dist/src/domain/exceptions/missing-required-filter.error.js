"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingRequiredFilterError = void 0;
const common_1 = require("@nestjs/common");
class MissingRequiredFilterError extends common_1.BadRequestException {
    constructor(filterName, datasourceName) {
        super(`Required filter '${filterName}' is missing for datasource '${datasourceName}'`);
        this.name = "MissingRequiredFilterError";
    }
}
exports.MissingRequiredFilterError = MissingRequiredFilterError;
//# sourceMappingURL=missing-required-filter.error.js.map