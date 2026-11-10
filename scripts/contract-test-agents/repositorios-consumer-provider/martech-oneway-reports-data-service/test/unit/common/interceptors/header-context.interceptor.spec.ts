import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, CallHandler } from "@nestjs/common";
import { of } from "rxjs";
import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";

describe("HeaderContextInterceptor", () => {
  let interceptor: HeaderContextInterceptor;
  let headerContextService: IHeaderContextService;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeaderContextInterceptor,
        {
          provide: "IHeaderContextService",
          useValue: {
            setHeaderContext: jest.fn(),
            getHeaderContext: jest.fn(),
            getRequestTraceId: jest.fn(),
            getCountry: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<HeaderContextInterceptor>(
      HeaderContextInterceptor,
    );
    headerContextService = module.get<IHeaderContextService>(
      "IHeaderContextService",
    );

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({})),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (headers: any): ExecutionContext => {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers,
        }),
      }),
    } as any;
  };

  describe("intercept", () => {
    it("should extract and set header context with all headers", (done) => {
      // Arrange
      const headers = {
        authorization: "Bearer token123",
        requesttraceid: "trace-123",
        country: "BR",
        accept: "application/json",
        "accept-language": "pt-BR",
        "content-type": "application/json",
      };
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalledWith({
            authorization: "Bearer token123",
            requestTraceId: "trace-123",
            country: "BR",
            accept: "application/json",
            acceptLanguage: "pt-BR",
            contentType: "application/json",
          });
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle camelCase requestTraceId header", (done) => {
      // Arrange
      const headers = {
        requestTraceId: "trace-456",
        country: "US",
      };
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
            expect.objectContaining({
              requestTraceId: "trace-456",
            }),
          );
          done();
        },
      });
    });

    it("should prioritize lowercase requesttraceid over camelCase", (done) => {
      // Arrange
      const headers = {
        requesttraceid: "trace-lowercase",
        requestTraceId: "trace-camelcase",
        country: "MX",
      };
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
            expect.objectContaining({
              requestTraceId: "trace-lowercase",
            }),
          );
          done();
        },
      });
    });

    it("should use default accept-language when not provided", (done) => {
      // Arrange
      const headers = {
        country: "AR",
      };
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
            expect.objectContaining({
              acceptLanguage: "en",
            }),
          );
          done();
        },
      });
    });

    it("should handle missing optional headers", (done) => {
      // Arrange
      const headers = {};
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalledWith({
            authorization: undefined,
            requestTraceId: undefined,
            country: undefined,
            accept: undefined,
            acceptLanguage: "en",
            contentType: undefined,
          });
          done();
        },
      });
    });

    it("should handle null headers object", (done) => {
      // Arrange
      const headers = null;
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle undefined headers object", (done) => {
      // Arrange
      const headers = undefined;
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should pass through the handler response", (done) => {
      // Arrange
      const expectedResponse = { data: "test data" };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(expectedResponse));
      const headers = { country: "BR" };
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (response) => {
          // Assert
          expect(response).toEqual(expectedResponse);
          done();
        },
      });
    });

    it("should handle special characters in header values", (done) => {
      // Arrange
      const headers = {
        authorization: "Bearer tôken-with-spéciäl-çhars",
        requesttraceid: "trace-123-ABC-xyz",
        country: "BR",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      };
      mockExecutionContext = createMockExecutionContext(headers);

      // Act
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        complete: () => {
          // Assert
          expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
            expect.objectContaining({
              authorization: "Bearer tôken-with-spéciäl-çhars",
              requestTraceId: "trace-123-ABC-xyz",
              acceptLanguage: "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            }),
          );
          done();
        },
      });
    });
  });
});
