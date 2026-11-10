import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import { DataServiceClient } from "@infrastructure/services/data-service.client";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";
import { of, throwError } from "rxjs";
import { AxiosResponse, AxiosError } from "axios";

describe("DataServiceClient", () => {
  let service: DataServiceClient;
  let httpService: jest.Mocked<HttpService>;
  let environmentConfigService: any;
  let headerContextService: jest.Mocked<IHeaderContextService>;
  let module: TestingModule;

  const mockBaseUrl = "http://localhost:3000/api";

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    } as any;

    environmentConfigService = {
      dataService: {
        baseUrl: mockBaseUrl,
      },
    };

    headerContextService = {
      getPropagatedHeaders: jest.fn(),
    } as any;

    module = await Test.createTestingModule({
      providers: [
        DataServiceClient,
        { provide: HttpService, useValue: httpService },
        {
          provide: "IEnvironmentConfigService",
          useValue: environmentConfigService,
        },
        {
          provide: "IHeaderContextService",
          useValue: headerContextService,
        },
      ],
    }).compile();

    service = module.get<DataServiceClient>(DataServiceClient);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe("constructor", () => {
    it("should initialize with valid baseUrl", () => {
      expect(service).toBeDefined();
    });

    it("should throw error when baseUrl is missing", () => {
      environmentConfigService.dataService = undefined;

      expect(
        () =>
          new DataServiceClient(
            httpService,
            environmentConfigService,
            headerContextService,
          ),
      ).toThrow("DATA_SERVICE_BASE_URL environment variable is required");
    });

    it("should throw error when baseUrl is empty string", () => {
      environmentConfigService.dataService = { baseUrl: "" };

      expect(
        () =>
          new DataServiceClient(
            httpService,
            environmentConfigService,
            headerContextService,
          ),
      ).toThrow("DATA_SERVICE_BASE_URL environment variable is required");
    });

    it("should throw error when dataService object is null", () => {
      environmentConfigService.dataService = null as any;

      expect(
        () =>
          new DataServiceClient(
            httpService,
            environmentConfigService,
            headerContextService,
          ),
      ).toThrow("DATA_SERVICE_BASE_URL environment variable is required");
    });
  });

  describe("get", () => {
    beforeEach(() => {
      headerContextService.getPropagatedHeaders.mockReturnValue({
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Correlation-Id": "test-id",
      });
    });

    it("should make GET request with correct URL", (done) => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: "test" },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources").subscribe((response) => {
        expect(httpService.get).toHaveBeenCalledWith(
          `${mockBaseUrl}/datasources`,
          expect.any(Object),
        );
        expect(response).toEqual(mockResponse);
        done();
      });
    });

    it("should include headers in request", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources").subscribe(() => {
        const callArgs = httpService.get.mock.calls[0][1];
        expect(callArgs.headers).toEqual({
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Correlation-Id": "test-id",
        });
        done();
      });
    });

    it("should pass query parameters to request", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));
      const params = { page: 1, limit: 10 };

      service.get("/datasources", params).subscribe(() => {
        const callArgs = httpService.get.mock.calls[0][1];
        expect(callArgs.params).toEqual(params);
        done();
      });
    });

    it("should handle empty endpoint", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("").subscribe(() => {
        expect(httpService.get).toHaveBeenCalledWith(
          mockBaseUrl,
          expect.any(Object),
        );
        done();
      });
    });

    it("should handle endpoint with special characters", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources/test-123_abc").subscribe(() => {
        expect(httpService.get).toHaveBeenCalledWith(
          `${mockBaseUrl}/datasources/test-123_abc`,
          expect.any(Object),
        );
        done();
      });
    });

    it("should return Observable with correct type", (done) => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: "test" },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = service.get<{ id: number; name: string }>("/datasources");
      expect(result).toBeDefined();
      result.subscribe((response) => {
        expect(response.data).toEqual({ id: 1, name: "test" });
        done();
      });
    });

    it("should call getPropagatedHeaders with base headers", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources").subscribe(() => {
        expect(headerContextService.getPropagatedHeaders).toHaveBeenCalledWith({
          "Content-Type": "application/json",
          Accept: "application/json",
        });
        done();
      });
    });

    it("should handle HTTP error response", (done) => {
      const mockError: AxiosError = {
        response: {
          status: 404,
          statusText: "Not Found",
          data: { error: "Resource not found" },
          headers: {},
          config: {} as any,
        },
        isAxiosError: true,
        code: "404",
        message: "Not Found",
        name: "AxiosError",
        config: {} as any,
        toJSON: () => ({}),
      } as any;

      httpService.get.mockReturnValue(throwError(() => mockError));

      service.get("/datasources/nonexistent").subscribe(
        () => {
          fail("should not succeed");
        },
        (error) => {
          expect(error).toEqual(mockError);
          done();
        },
      );
    });

    it("should handle network error", (done) => {
      const mockError = new Error("Network Error");

      httpService.get.mockReturnValue(throwError(() => mockError));

      service.get("/datasources").subscribe(
        () => {
          fail("should not succeed");
        },
        (error) => {
          expect(error.message).toBe("Network Error");
          done();
        },
      );
    });

    it("should handle undefined params", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources", undefined).subscribe(() => {
        const callArgs = httpService.get.mock.calls[0][1];
        expect(callArgs.params).toBeUndefined();
        done();
      });
    });

    it("should handle null params object", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources", null as any).subscribe(() => {
        const callArgs = httpService.get.mock.calls[0][1];
        expect(callArgs.params).toBeNull();
        done();
      });
    });

    it("should handle empty params object", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));
      const params = {};

      service.get("/datasources", params).subscribe(() => {
        const callArgs = httpService.get.mock.calls[0][1];
        expect(callArgs.params).toEqual({});
        done();
      });
    });

    it("should handle multiple query parameters", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));
      const params = { page: 2, limit: 20, sort: "name", order: "asc" };

      service.get("/datasources", params).subscribe(() => {
        const callArgs = httpService.get.mock.calls[0][1];
        expect(callArgs.params).toEqual(params);
        done();
      });
    });

    it("should handle endpoint with leading slash", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/data").subscribe(() => {
        expect(httpService.get).toHaveBeenCalledWith(
          `${mockBaseUrl}/data`,
          expect.any(Object),
        );
        done();
      });
    });

    it("should handle endpoint without leading slash", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("data").subscribe(() => {
        expect(httpService.get).toHaveBeenCalledWith(
          `${mockBaseUrl}data`,
          expect.any(Object),
        );
        done();
      });
    });

    it("should handle 200 status response", (done) => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources").subscribe((response) => {
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        done();
      });
    });

    it("should handle 201 status response", (done) => {
      const mockResponse: AxiosResponse = {
        data: { id: 1 },
        status: 201,
        statusText: "Created",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources").subscribe((response) => {
        expect(response.status).toBe(201);
        done();
      });
    });

    it("should make only one HTTP call per get invocation", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources").subscribe(() => {
        expect(httpService.get).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it("should call httpService.get with url as first argument", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/test").subscribe(() => {
        const firstArg = httpService.get.mock.calls[0][0];
        expect(typeof firstArg).toBe("string");
        expect(firstArg).toContain(mockBaseUrl);
        done();
      });
    });

    it("should call httpService.get with config object as second argument", (done) => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      service.get("/datasources").subscribe(() => {
        const secondArg = httpService.get.mock.calls[0][1];
        expect(typeof secondArg).toBe("object");
        expect(secondArg).toHaveProperty("headers");
        done();
      });
    });
  });
});
