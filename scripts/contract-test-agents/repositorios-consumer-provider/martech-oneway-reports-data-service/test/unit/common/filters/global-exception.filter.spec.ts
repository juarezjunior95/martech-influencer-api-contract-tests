import { ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import {
  GlobalExceptionFilter,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "@common/filters/global-exception.filter";

describe("GlobalExceptionFilter", () => {
  let filter: GlobalExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockArgumentsHost = {
      getType: jest.fn().mockReturnValue("http"),
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("catch", () => {
    it("should handle HttpException with string response", () => {
      // Arrange
      const exception = new HttpException("Not Found", HttpStatus.NOT_FOUND);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Not Found",
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: expect.any(String),
      });
    });

    it("should handle HttpException with object response", () => {
      // Arrange
      const exception = new HttpException(
        { message: "Validation failed" },
        HttpStatus.BAD_REQUEST,
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Validation failed",
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
      });
    });

    it("should handle HttpException with object response without message property", () => {
      // Arrange
      const exception = new HttpException(
        { error: "Something went wrong" } as any,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: exception.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
      });
    });

    it("should handle standard Error instance", () => {
      // Arrange
      const exception = new Error("Standard error occurred");

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
      });
    });

    it("should handle unknown exception type", () => {
      // Arrange
      const exception = "Unknown error";

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
      });
    });

    it("should handle null exception", () => {
      // Arrange
      const exception = null;

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
      });
    });

    it("should include valid ISO timestamp", () => {
      // Arrange
      const exception = new HttpException("Test", HttpStatus.BAD_REQUEST);
      const beforeTime = new Date().toISOString();

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const afterTime = new Date().toISOString();
      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(callArgs.timestamp >= beforeTime).toBe(true);
      expect(callArgs.timestamp <= afterTime).toBe(true);
    });

    it("should throw exception for non-HTTP contexts", () => {
      // Arrange
      mockArgumentsHost.getType = jest.fn().mockReturnValue("rpc");
      const exception = new Error("Queue processing error");

      // Act & Assert
      expect(() => filter.catch(exception, mockArgumentsHost)).toThrow(
        exception,
      );
    });

    it("should throw exception for websocket contexts", () => {
      // Arrange
      mockArgumentsHost.getType = jest.fn().mockReturnValue("ws");
      const exception = new HttpException(
        "WebSocket error",
        HttpStatus.BAD_REQUEST,
      );

      // Act & Assert
      expect(() => filter.catch(exception, mockArgumentsHost)).toThrow(
        exception,
      );
    });

    it("should handle HttpException with different status codes", () => {
      // Arrange
      const testCases = [
        { status: HttpStatus.UNAUTHORIZED, message: "Unauthorized" },
        { status: HttpStatus.FORBIDDEN, message: "Forbidden" },
        { status: HttpStatus.CONFLICT, message: "Conflict" },
        { status: HttpStatus.UNPROCESSABLE_ENTITY, message: "Unprocessable" },
      ];

      testCases.forEach(({ status, message }) => {
        // Arrange
        jest.clearAllMocks();
        const exception = new HttpException(message, status);

        // Act
        filter.catch(exception, mockArgumentsHost);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(status);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message,
          statusCode: status,
          timestamp: expect.any(String),
        });
      });
    });
  });
});
