import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";

describe("HeaderContextInterceptor", () => {
  it("should set header context and call next.handle", () => {
    const headerContextService = { setHeaderContext: jest.fn() } as any;
    const interceptor = new HeaderContextInterceptor(headerContextService);

    const req = {
      headers: {
        authorization: "auth",
        requesttraceid: "rid",
        country: "BR",
        accept: "a",
        "accept-language": "pt",
        "content-type": "ct",
      },
    };
    const context: any = { switchToHttp: () => ({ getRequest: () => req }) };

    const next = { handle: jest.fn().mockReturnValue("handled") } as any;

    const result = interceptor.intercept(context as any, next as any);

    expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
      expect.objectContaining({
        authorization: "auth",
        requestTraceId: "rid",
        country: "BR",
      }),
    );
    expect(next.handle).toHaveBeenCalled();
    expect(result).toBe("handled");
  });

  it("should handle requestTraceId fallback when requesttraceid is missing (line 22)", () => {
    const headerContextService = { setHeaderContext: jest.fn() } as any;
    const interceptor = new HeaderContextInterceptor(headerContextService);

    const req = {
      headers: {
        authorization: "auth",
        requestTraceId: "rid-from-camelcase",
        country: "BR",
      },
    };
    const context: any = { switchToHttp: () => ({ getRequest: () => req }) };

    const next = { handle: jest.fn().mockReturnValue("handled") } as any;

    interceptor.intercept(context as any, next as any);

    expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
      expect.objectContaining({ requestTraceId: "rid-from-camelcase" }),
    );
  });

  it("should handle missing country header (line 23)", () => {
    const headerContextService = { setHeaderContext: jest.fn() } as any;
    const interceptor = new HeaderContextInterceptor(headerContextService);

    const req = { headers: { authorization: "auth", requesttraceid: "rid" } };
    const context: any = { switchToHttp: () => ({ getRequest: () => req }) };

    const next = { handle: jest.fn().mockReturnValue("handled") } as any;

    interceptor.intercept(context as any, next as any);

    expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
      expect.objectContaining({ country: undefined }),
    );
  });

  it("should use default acceptLanguage when accept-language header is missing (line 30)", () => {
    const headerContextService = { setHeaderContext: jest.fn() } as any;
    const interceptor = new HeaderContextInterceptor(headerContextService);

    const req = {
      headers: { authorization: "auth", requesttraceid: "rid", country: "BR" },
    };
    const context: any = { switchToHttp: () => ({ getRequest: () => req }) };

    const next = { handle: jest.fn().mockReturnValue("handled") } as any;

    interceptor.intercept(context as any, next as any);

    expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
      expect.objectContaining({ acceptLanguage: "en" }),
    );
  });

  it("should handle missing headers object gracefully (line 22-30)", () => {
    const headerContextService = { setHeaderContext: jest.fn() } as any;
    const interceptor = new HeaderContextInterceptor(headerContextService);

    const req = { headers: {} };
    const context: any = { switchToHttp: () => ({ getRequest: () => req }) };

    const next = { handle: jest.fn().mockReturnValue("handled") } as any;

    interceptor.intercept(context as any, next as any);

    expect(headerContextService.setHeaderContext).toHaveBeenCalledWith(
      expect.objectContaining({
        authorization: undefined,
        requestTraceId: undefined,
        country: undefined,
        accept: undefined,
        acceptLanguage: "en",
        contentType: undefined,
      }),
    );
  });
});
