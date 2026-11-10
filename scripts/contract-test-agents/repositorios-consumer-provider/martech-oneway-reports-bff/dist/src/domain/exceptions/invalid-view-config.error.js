"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidViewConfigError = void 0;
const common_1 = require("@nestjs/common");
class InvalidViewConfigError extends common_1.UnprocessableEntityException {
    constructor(message) {
        super(message);
        this.name = "InvalidViewConfigError";
    }
}
exports.InvalidViewConfigError = InvalidViewConfigError;
//# sourceMappingURL=invalid-view-config.error.js.map