"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageCache = void 0;
class PageCache {
    constructor(props) {
        this.name = props.name;
        this.hash = props.hash;
        this.config = props.config;
    }
    static create(props) {
        return new PageCache(props);
    }
    getName() {
        return this.name;
    }
    getHash() {
        return this.hash;
    }
    getCacheConfig() {
        return this.config.cache;
    }
    getVersion() {
        return this.config.version;
    }
}
exports.PageCache = PageCache;
//# sourceMappingURL=page-cache.entity.js.map