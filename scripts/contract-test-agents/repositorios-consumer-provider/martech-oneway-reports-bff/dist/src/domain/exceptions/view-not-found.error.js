"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewNotFoundError = void 0;
const common_1 = require("@nestjs/common");
class ViewNotFoundError extends common_1.NotFoundException {
    constructor(viewName) {
        if (viewName) {
            super(`View '${viewName}' not found`);
        }
        else {
            super(`View not found`);
        }
        this.name = "ViewNotFoundError";
    }
}
exports.ViewNotFoundError = ViewNotFoundError;
//# sourceMappingURL=view-not-found.error.js.map