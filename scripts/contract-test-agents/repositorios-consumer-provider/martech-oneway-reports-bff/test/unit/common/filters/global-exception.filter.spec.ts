import { GlobalExceptionFilter } from "@common/filters/global-exception.filter";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("GlobalExceptionFilter", () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it("should rethrow for non-http contexts", () => {
    const host: any = { getType: () => "rpc" };
    const err = new Error("boom");

    expect(() => filter.catch(err, host)).toThrow(err);
  });

  it("should return formatted http response for HttpException", () => {
    const responseMock = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    const ctx: any = {
      getType: () => "http",
      switchToHttp: () => ({ getResponse: () => responseMock }),
    };

    const httpEx = new HttpException("bad", HttpStatus.BAD_REQUEST);

    filter.catch(httpEx, ctx as any);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.status().json).toHaveBeenCalled();
  });

  it("should handle generic Error with 500 status", () => {
    const responseMock = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    const ctx: any = {
      getType: () => "http",
      switchToHttp: () => ({ getResponse: () => responseMock }),
    };

    filter.catch(new Error("something"), ctx as any);

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it("should handle HttpException with object response containing message (line 42-44)", () => {
    const responseMock = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    const ctx: any = {
      getType: () => "http",
      switchToHttp: () => ({ getResponse: () => responseMock }),
    };

    const httpEx = new HttpException(
      { message: "custom error message" },
      HttpStatus.BAD_GATEWAY,
    );

    filter.catch(httpEx, ctx as any);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
    const jsonCall = responseMock.status().json.mock.calls[0][0];
    expect(jsonCall.message).toBe("custom error message");
  });

  it("should handle HttpException with object response without message property (line 42-44)", () => {
    const responseMock = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    const ctx: any = {
      getType: () => "http",
      switchToHttp: () => ({ getResponse: () => responseMock }),
    };

    const httpEx = new HttpException(
      { error: "some error" },
      HttpStatus.CONFLICT,
    );
    (httpEx as any).message = "exception message";

    filter.catch(httpEx, ctx as any);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    const jsonCall = responseMock.status().json.mock.calls[0][0];
    expect(jsonCall.message).toBe("exception message");
  });

  it("should handle non-Error exception (line 51-52)", () => {
    const responseMock = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    const ctx: any = {
      getType: () => "http",
      switchToHttp: () => ({ getResponse: () => responseMock }),
    };

    const unknownException = "string error";

    filter.catch(unknownException, ctx as any);

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    const jsonCall = responseMock.status().json.mock.calls[0][0];
    expect(jsonCall.message).toBe("Internal server error");
  });
});
