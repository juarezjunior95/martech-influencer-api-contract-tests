export interface PageCacheCacheConfig {
    enabled: boolean;
    freshWindowSeconds: number;
    staleWindowSeconds: number;
    maxSize: number;
    compression: "gzip";
    tags: string[];
}
export interface PageCacheConfig {
    version: string;
    cache: PageCacheCacheConfig;
}
export interface PageCacheProps {
    name: string;
    hash: string;
    config: PageCacheConfig;
}
export declare class PageCache {
    private readonly name;
    private readonly hash;
    private readonly config;
    private constructor();
    static create(props: PageCacheProps): PageCache;
    getName(): string;
    getHash(): string;
    getCacheConfig(): PageCacheCacheConfig;
    getVersion(): string;
}
