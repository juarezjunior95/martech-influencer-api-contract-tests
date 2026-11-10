"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsureArrayCommand = void 0;
class EnsureArrayCommand {
    constructor() {
        this.name = "ensureArray";
    }
    execute(value) {
        if (Array.isArray(value))
            return value;
        if (value === undefined || value === null)
            return [];
        return [value];
    }
}
exports.EnsureArrayCommand = EnsureArrayCommand;
//# sourceMappingURL=EnsureArrayCommand.js.map