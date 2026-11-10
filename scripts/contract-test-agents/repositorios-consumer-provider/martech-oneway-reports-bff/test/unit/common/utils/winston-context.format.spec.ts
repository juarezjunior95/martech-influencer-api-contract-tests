import {
  winstonContextFormat,
  requestContextStorage,
} from "@common/utils/winston-context.format";

describe("winstonContextFormat", () => {
  it("should return original info when no context", () => {
    jest
      .spyOn(requestContextStorage, "getStore")
      .mockReturnValue(undefined as any);
    const format = winstonContextFormat();
    const info: any = { level: "info", message: "m" };
    expect(format.transform(info)).toEqual(info);
  });

  it("should add requestTraceId and country when present", () => {
    jest
      .spyOn(requestContextStorage, "getStore")
      .mockReturnValue({ requestTraceId: "r", country: "BR" } as any);
    const format = winstonContextFormat();
    const info: any = { level: "info", message: "m" };
    const out: any = (format as any).transform(info);
    expect(out.requestTraceId).toBe("r");
    expect(out.country).toBe("BR");
  });

  it("should add only requestTraceId when country missing (covers lines 17-19)", () => {
    jest
      .spyOn(requestContextStorage, "getStore")
      .mockReturnValue({ requestTraceId: "only-r" } as any);
    const format = winstonContextFormat();
    const info: any = { level: "info", message: "m" };
    const out: any = (format as any).transform(info);
    expect(out.requestTraceId).toBe("only-r");
    expect(out.country).toBeUndefined();
  });

  it("should add only country when requestTraceId missing (covers lines 19-20)", () => {
    jest
      .spyOn(requestContextStorage, "getStore")
      .mockReturnValue({ country: "US" } as any);
    const format = winstonContextFormat();
    const info: any = { level: "info", message: "m" };
    const out: any = (format as any).transform(info);
    expect(out.country).toBe("US");
    expect(out.requestTraceId).toBeUndefined();
  });
});
