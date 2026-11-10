"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        freshWindowSeconds: 2592000,
        staleWindowSeconds: 7776000,
        maxSize: 5 * 1024 * 1024,
        compression: "gzip",
        tags: ["page-cache", "pos-book-export"],
    },
};
exports.default = config;
//# sourceMappingURL=pos-book-export.page-cache.js.map