"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetNotFoundError = void 0;
class PresetNotFoundError extends Error {
    constructor(message = "Preset not found") {
        super(message);
        this.name = "PresetNotFoundError";
    }
}
exports.PresetNotFoundError = PresetNotFoundError;
//# sourceMappingURL=preset-not-found.error.js.map