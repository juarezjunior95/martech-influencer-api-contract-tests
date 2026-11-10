"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withImagePathPrefix = withImagePathPrefix;
function withImagePathPrefix(imagePath) {
    const raw = process.env.CDN_BASE_URL;
    const prefix = raw === undefined || raw === null ? "" : String(raw).replace(/\/+$/, "");
    const path = imagePath.replace(/^\/+/, "");
    if (!prefix) {
        return path;
    }
    return `${prefix}/${path}`;
}
//# sourceMappingURL=image-path-prefix.utils.js.map