import { IViewConfigRepository } from "@domain/repositories/view-config.repository.interface";
import { IDataRepository } from "@domain/repositories/datasource.repository.interface";
import { IFormatterRepository } from "@domain/repositories/formatter.repository.interface";
import { IViewCacheRepository } from "@domain/repositories/view-cache.repository.interface";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
import { DataSourceFactory, ViewConfigFactory } from "./factories/view.factory";

/**
 * Mock for ViewConfigRepository
 * Example use:
 * const repo = mockViewConfigRepository();
 * jest.spyOn(repo, "getByName").mockResolvedValue(config);
 */
export function mockViewConfigRepository(): Partial<IViewConfigRepository> {
  return {
    getByName: jest.fn(),
  };
}

/**
 * Mock for DataRepository with normal behavior
 */
export function mockDataRepository(): Partial<IDataRepository> {
  return {
    getData: jest.fn().mockResolvedValue(
      DataSourceFactory.create({
        name: "default-datasource",
      }),
    ),
  };
}

/**
 * Mock for FormatterRepository with normal behavior
 */
export function mockFormatterRepository(): Partial<IFormatterRepository> {
  return {
    format: jest.fn().mockResolvedValue({
      formatted: true,
      timestamp: new Date().toISOString(),
    }),
  };
}

/**
 * Mock for ViewCacheRepository
 */
export function mockViewCacheRepository(): Partial<IViewCacheRepository> {
  return {
    getView: jest.fn(),
    setView: jest.fn(),
    invalidateByTags: jest.fn(),
  };
}

/**
 * Mock for UserRepository
 */
export function mockUserRepository(): Partial<IUserRepository> {
  return {
    getCurrentUser: jest.fn().mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    }),
  };
}

/**
 * Helper to create Promise.all spies
 * Useful for validating paralel operations being used
 */
export function createPromiseAllSpy() {
  const spy = jest.spyOn(Promise, "all");
  return {
    spy,
    restore: () => spy.mockRestore(),
    callCount: () => spy.mock.calls.length,
  };
}

/**
 * Helper to test error handling
 * Example use:
 * jest.spyOn(repo, "getByName").mockImplementation(throwError("ViewNotFoundError"));
 */
export function throwError(message: string) {
  return () => {
    throw new Error(message);
  };
}

/**
 * Helper to test timeout
 */
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper to create a complete view config with mocks
 */
export function createCompleteViewConfigMock() {
  return {
    getByName: jest.fn().mockResolvedValue(ViewConfigFactory.create()),
    getAll: jest
      .fn()
      .mockResolvedValue([ViewConfigFactory.create({ components: [] })]),
    exists: jest.fn().mockResolvedValue(true),
  };
}

/**
 * Helper to create multiple datasources
 */
export function createMultipleDatasources(count: number) {
  return Array.from({ length: count }, (_, i) =>
    DataSourceFactory.create({ name: `datasource-${i + 1}` }),
  );
}

/**
 * Helper to validate processed response structure
 */
export function validateProcessedViewResult(result: any) {
  expect(result).toHaveProperty("view");
  expect(result).toHaveProperty("components");
  expect(Array.isArray(result.components)).toBe(true);

  result.components.forEach((component: any) => {
    expect(component).toHaveProperty("id");
    expect(
      component.hasOwnProperty("data") || component.hasOwnProperty("error"),
    ).toBe(true);
  });
}

/**
 * Helper for debug logging
 */
export function logTestStep(step: string, details?: any) {
  if (process.env.DEBUG_TESTS) {
    console.log(`✓ ${step}`, details ? JSON.stringify(details, null, 2) : "");
  }
}
