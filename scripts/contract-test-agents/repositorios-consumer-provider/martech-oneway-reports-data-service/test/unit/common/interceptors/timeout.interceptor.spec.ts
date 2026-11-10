import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, CallHandler } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { TimeoutInterceptor } from "@common/interceptors/timeout.interceptor";
import { ConfigService } from "@nestjs/config";

// Mock ConfigService globally for the interceptor's static usage
jest.mock("@nestjs/config", () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue("20000"),
  })),
}));

describe("TimeoutInterceptor", () => {
  let interceptor: TimeoutInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeoutInterceptor],
    }).compile();

    interceptor = module.get<TimeoutInterceptor>(TimeoutInterceptor);

    mockExecutionContext = {} as ExecutionContext;
    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("intercept", () => {
    it("should complete successfully when request finishes before timeout", (done) => {
      // Arrange
      const expectedResponse = { data: "test data" };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(expectedResponse));

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (response) => {
          // Assert
          expect(response).toEqual(expectedResponse);
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should pass through non-timeout errors", (done) => {
      // Arrange
      const testError = new Error("Custom error");
      mockCallHandler.handle = jest
        .fn()
        .mockReturnValue(throwError(() => testError));

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          // Assert
          expect(error).toBe(testError);
          expect(error.message).toBe("Custom error");
          done();
        },
      });
    });

    it("should use default timeout when TIMEOUT env var is not set", (done) => {
      // Arrange
      const MockConfigService = ConfigService as jest.MockedClass<
        typeof ConfigService
      >;
      MockConfigService.mockImplementation(
        () =>
          ({
            get: jest.fn().mockReturnValue(undefined),
          }) as any,
      );

      const defaultTimeoutInterceptor = new TimeoutInterceptor();
      const expectedResponse = { data: "test" };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(expectedResponse));

      // Act
      defaultTimeoutInterceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe({
          next: (response) => {
            // Assert
            expect(response).toEqual(expectedResponse);
            done();
          },
        });
    });

    it("should handle empty string timeout value", (done) => {
      // Arrange
      const MockConfigService = ConfigService as jest.MockedClass<
        typeof ConfigService
      >;
      MockConfigService.mockImplementation(
        () =>
          ({
            get: jest.fn().mockReturnValue(""),
          }) as any,
      );

      const emptyTimeoutInterceptor = new TimeoutInterceptor();
      const expectedResponse = { data: "test" };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(expectedResponse));

      // Act
      emptyTimeoutInterceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe({
          next: (response) => {
            // Assert
            expect(response).toEqual(expectedResponse);
            done();
          },
        });
    });

    it("should handle string timeout value", (done) => {
      // Arrange
      const MockConfigService = ConfigService as jest.MockedClass<
        typeof ConfigService
      >;
      MockConfigService.mockImplementation(
        () =>
          ({
            get: jest.fn().mockReturnValue("5000"),
          }) as any,
      );

      const stringTimeoutInterceptor = new TimeoutInterceptor();
      const expectedResponse = { data: "test" };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(expectedResponse));

      // Act
      stringTimeoutInterceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe({
          next: (response) => {
            // Assert
            expect(response).toEqual(expectedResponse);
            done();
          },
        });
    });

    it("should handle multiple sequential requests", (done) => {
      // Arrange
      const response1 = { data: "first" };
      const response2 = { data: "second" };
      let callCount = 0;

      mockCallHandler.handle = jest.fn().mockImplementation(() => {
        callCount++;
        return of(callCount === 1 ? response1 : response2);
      });

      // Act - First request
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (response) => {
          expect(response).toEqual(response1);

          // Act - Second request
          interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .subscribe({
              next: (response) => {
                // Assert
                expect(response).toEqual(response2);
                expect(mockCallHandler.handle).toHaveBeenCalledTimes(2);
                done();
              },
            });
        },
      });
    });
  });
});
