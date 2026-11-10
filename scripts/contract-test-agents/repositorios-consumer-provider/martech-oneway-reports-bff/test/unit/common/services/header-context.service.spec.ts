import { HeaderContextService } from "@common/services/header-context.service";
import { requestContextStorage } from "@common/utils/winston-context.format";

describe("HeaderContextService", () => {
  let svc: HeaderContextService;

  beforeEach(() => {
    svc = new HeaderContextService();
    jest.spyOn(requestContextStorage, "enterWith").mockImplementation(() => {});
  });

  it("should set and get header context", () => {
    svc.setHeaderContext({ requestTraceId: "abc", country: "BR" } as any);
    expect(svc.getHeaderContext()).toEqual({
      requestTraceId: "abc",
      country: "BR",
    });
    expect(svc.getRequestTraceId()).toBe("abc");
    expect(svc.getCountry()).toBe("BR");
  });

  it("getPropagatedHeaders should merge headers when context present", () => {
    svc.setHeaderContext({
      authorization: "tok",
      requestTraceId: "rid",
      country: "BR",
      accept: "a",
      acceptLanguage: "pt",
      contentType: "ct",
    } as any);

    const base = { "Content-Type": "application/json" };
    const res = svc.getPropagatedHeaders(base);

    expect(res["Authorization"]).toBe("tok");
    expect(res["requestTraceId"]).toBe("rid");
    expect(res["country"]).toBe("BR");
    expect(res["Accept"]).toBe("a");
    expect(res["Accept-Language"]).toBe("pt");
    expect(res["Content-Type"]).toBe("ct");
  });

  it("getPropagatedHeaders should return base when no context", () => {
    const s2 = new HeaderContextService();
    const base = { a: "b" };
    expect(s2.getPropagatedHeaders(base)).toEqual(base);
  });

  it("getPropagatedHeaders should skip undefined/missing properties (line 38-53)", () => {
    svc.setHeaderContext({
      requestTraceId: "rid",
      country: "BR",
      // All other properties undefined
    } as any);

    const base = { "Content-Type": "application/json" };
    const res = svc.getPropagatedHeaders(base);

    expect(res["Authorization"]).toBeUndefined();
    expect(res["requestTraceId"]).toBe("rid");
    expect(res["country"]).toBe("BR");
    expect(res["Accept"]).toBeUndefined();
    expect(res["Accept-Language"]).toBeUndefined();
    expect(res["Content-Type"]).toBe("application/json");
  });

  it("getPropagatedHeaders should handle partial headers (line 38-53)", () => {
    svc.setHeaderContext({
      authorization: "Bearer token",
      accept: "application/json",
      // Other properties undefined
    } as any);

    const base = { "X-Custom": "value" };
    const res = svc.getPropagatedHeaders(base);

    expect(res["Authorization"]).toBe("Bearer token");
    expect(res["Accept"]).toBe("application/json");
    expect(res["requestTraceId"]).toBeUndefined();
    expect(res["country"]).toBeUndefined();
    expect(res["Accept-Language"]).toBeUndefined();
    expect(res["Content-Type"]).toBeUndefined();
    expect(res["X-Custom"]).toBe("value");
  });

  it("getPropagatedHeaders should handle acceptLanguage and contentType (line 38-53)", () => {
    svc.setHeaderContext({
      acceptLanguage: "pt-BR",
      contentType: "application/json",
    } as any);

    const base = {};
    const res = svc.getPropagatedHeaders(base);

    expect(res["Accept-Language"]).toBe("pt-BR");
    expect(res["Content-Type"]).toBe("application/json");
    expect(res["Authorization"]).toBeUndefined();
    expect(res["requestTraceId"]).toBeUndefined();
    expect(res["country"]).toBeUndefined();
    expect(res["Accept"]).toBeUndefined();
  });
});
