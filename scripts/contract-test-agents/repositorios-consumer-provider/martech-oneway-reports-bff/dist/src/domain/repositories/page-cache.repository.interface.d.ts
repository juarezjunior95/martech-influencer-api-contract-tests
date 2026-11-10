export interface PageCacheStoredEntry {
    html: string;
    ttlRemainingSeconds: number | null;
}
export interface IPageCacheRepository {
    get(name: string, hash: string): Promise<string | null>;
    getStoredEntry(name: string, hash: string): Promise<PageCacheStoredEntry | null>;
    set(name: string, hash: string, data: string, expirationSeconds: number, tags: string[]): Promise<boolean>;
    acquireRevalidationLock(name: string, hash: string, ttlSeconds: number): Promise<boolean>;
    releaseRevalidationLock(name: string, hash: string): Promise<boolean>;
    invalidateByTags(tags: string[]): Promise<number>;
}
