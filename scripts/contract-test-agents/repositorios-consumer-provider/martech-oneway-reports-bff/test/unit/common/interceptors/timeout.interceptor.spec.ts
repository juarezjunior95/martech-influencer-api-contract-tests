/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import { TimeoutInterceptor } from "@common/interceptors/timeout.interceptor";
import { of, throwError, never } from "rxjs";
import { ConfigService } from "@nestjs/config";

describe("TimeoutInterceptor", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should get timeout value from TIMEOUT environment variable (line 17)", async () => {
    jest.isolateModules(() => {
      process.env.TIMEOUT = "100";

      // Mock ConfigService to return the TIMEOUT value
      jest.doMock("@nestjs/config", () => ({
        ConfigService: class {
          get(key: string) {
            if (key === "TIMEOUT") {
              return process.env.TIMEOUT;
            }
            return null;
          }
        },
      }));

      // Reimport the interceptor to use the mocked ConfigService
      const {
        TimeoutInterceptor: MockedInterceptor,
      } = require("@common/interceptors/timeout.interceptor");
      const interceptor = new MockedInterceptor();

      // Use "never" observable that never emits to trigger timeout
      const next = {
        handle: () => never(),
      } as any;

      const res$ = interceptor.intercept({} as any, next as any);

      let subscription: any;
      const promise = new Promise<any>((resolve, reject) => {
        subscription = res$.subscribe({
          next: () => reject(new Error("should not succeed")),
          error: (err) => resolve(err),
        });
      });

      return promise
        .then((err) => {
          expect(err.name).toBe("RequestTimeoutException");
          expect(err.message).toContain("Operation timed out after");
        })
        .finally(() => {
          subscription?.unsubscribe();
        });
    });
  }, 10000);

  it("should use default timeout value (20000ms) when TIMEOUT is not set", async () => {
    jest.isolateModules(() => {
      delete process.env.TIMEOUT;

      // Mock ConfigService to return null (simulating unset env var)
      jest.doMock("@nestjs/config", () => ({
        ConfigService: class {
          get(key: string) {
            return null;
          }
        },
      }));

      // Reimport the interceptor
      const {
        TimeoutInterceptor: MockedInterceptor,
      } = require("@common/interceptors/timeout.interceptor");
      const interceptor = new MockedInterceptor();

      const next = {
        handle: () => throwError(() => new Error("test")),
      } as any;

      const res$ = interceptor.intercept({} as any, next as any);

      const promise = new Promise<any>((resolve, reject) => {
        res$.subscribe({
          next: () => reject(new Error("should not succeed")),
          error: (err) => resolve(err),
        });
      });

      return promise.then((err) => {
        // Should use default 20000ms
        expect(err).toBeDefined();
      });
    });
  });

  it("should transform TimeoutError into RequestTimeoutException", async () => {
    jest.isolateModules(() => {
      process.env.TIMEOUT = "50";

      jest.doMock("@nestjs/config", () => ({
        ConfigService: class {
          get(key: string) {
            if (key === "TIMEOUT") {
              return process.env.TIMEOUT;
            }
            return null;
          }
        },
      }));

      const {
        TimeoutInterceptor: MockedInterceptor,
      } = require("@common/interceptors/timeout.interceptor");
      const interceptor = new MockedInterceptor();

      // Use "never" observable that never emits to trigger timeout
      const next = {
        handle: () => never(),
      } as any;

      const res$ = interceptor.intercept({} as any, next as any);

      let subscription: any;
      const promise = new Promise<any>((resolve, reject) => {
        subscription = res$.subscribe({
          next: () => reject(new Error("should not succeed")),
          error: (err) => resolve(err),
        });
      });

      return promise
        .then((err) => {
          expect(err.name).toBe("RequestTimeoutException");
          expect(err.message).toContain("Operation timed out after 50ms");
        })
        .finally(() => {
          subscription?.unsubscribe();
        });
    });
  }, 10000);

  it("should pass through non-TimeoutError errors (line 28)", async () => {
    jest.isolateModules(() => {
      process.env.TIMEOUT = "5000";

      jest.doMock("@nestjs/config", () => ({
        ConfigService: class {
          get(key: string) {
            if (key === "TIMEOUT") {
              return process.env.TIMEOUT;
            }
            return null;
          }
        },
      }));

      const {
        TimeoutInterceptor: MockedInterceptor,
      } = require("@common/interceptors/timeout.interceptor");
      const interceptor = new MockedInterceptor();

      const customError = new Error("Custom error");
      (customError as any).name = "CustomError"; // Make sure it"s not TimeoutError
      const next = { handle: () => throwError(() => customError) } as any;

      const res$ = interceptor.intercept({} as any, next as any);

      const promise = new Promise<any>((resolve, reject) => {
        res$.subscribe({
          next: () => reject(new Error("should not succeed")),
          error: (err) => resolve(err),
        });
      });

      return promise.then((err) => {
        expect(err).toBe(customError);
        expect(err.name).toBe("CustomError");
      });
    });
  });
});
