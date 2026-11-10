import { IViewConfigRepository } from "../../src/domain/repositories/view-config.repository.interface";
import { IDataRepository } from "../../src/domain/repositories/datasource.repository.interface";
import { IFormatterRepository } from "../../src/domain/repositories/formatter.repository.interface";
import { IViewCacheRepository } from "../../src/domain/repositories/view-cache.repository.interface";
import { IUserRepository } from "../../src/domain/repositories/user.repository.interface";
export declare function mockViewConfigRepository(): Partial<IViewConfigRepository>;
export declare function mockDataRepository(): Partial<IDataRepository>;
export declare function mockFormatterRepository(): Partial<IFormatterRepository>;
export declare function mockViewCacheRepository(): Partial<IViewCacheRepository>;
export declare function mockUserRepository(): Partial<IUserRepository>;
export declare function createPromiseAllSpy(): {
    spy: jest.SpyInstance<Promise<[] | unknown[]>, [values: [] | readonly unknown[]], any>;
    restore: () => void;
    callCount: () => number;
};
export declare function throwError(message: string): () => never;
export declare function delay(ms: number): Promise<unknown>;
export declare function createCompleteViewConfigMock(): {
    getByName: jest.Mock<any, any, any>;
    getAll: jest.Mock<any, any, any>;
    exists: jest.Mock<any, any, any>;
};
export declare function createMultipleDatasources(count: number): import("../../src/domain/entities/view.entity").DataSource[];
export declare function validateProcessedViewResult(result: any): void;
export declare function logTestStep(step: string, details?: any): void;
