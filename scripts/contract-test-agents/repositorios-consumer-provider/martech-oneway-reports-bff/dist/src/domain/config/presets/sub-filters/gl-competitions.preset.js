"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        "gl-competitions": {
            filters: [{ name: "type", value: "cup" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=gl-competitions.preset.js.map