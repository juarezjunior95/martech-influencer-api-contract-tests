jest.mock("jwt-decode", () => ({ jwtDecode: jest.fn() }));

import { CurrentUserRepository } from "@infrastructure/repositories/user.repository";
import { jwtDecode } from "jwt-decode";

describe("CurrentUserRepository", () => {
  let repo: CurrentUserRepository;
  const headerContextService: any = { getHeaderContext: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new CurrentUserRepository(headerContextService as any);
  });

  it("should return null when no token", async () => {
    headerContextService.getHeaderContext.mockReturnValue({});
    const res = await repo.getCurrentUser();
    expect(res).toBeNull();
  });

  it("should decode token and return user entity with array scopes", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer tok",
    });
    (jwtDecode as jest.Mock).mockReturnValue({
      scopes: ["OneWayReports.a", "Other"],
      country: "BR",
    });

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toContain("OneWayReports.a");
    expect(res!.getScopes(true)).toEqual(["OneWayReports.a"]);
  });

  it("should decode token with single scope string", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "tok",
    });
    (jwtDecode as jest.Mock).mockReturnValue({
      scopes: "OneWayReports.x",
      country: "US",
    });

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toEqual(["OneWayReports.x"]);
  });

  it("should handle invalid token decode", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "bad",
    });
    (jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error("bad token");
    });

    const res = await repo.getCurrentUser();
    expect(res).toBeNull();
  });

  it("should cache current user on subsequent calls", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer tok2",
    });
    (jwtDecode as jest.Mock).mockReturnValue({
      scopes: ["OneWayReports.a"],
      country: "BR",
    });

    const first = await repo.getCurrentUser();
    const second = await repo.getCurrentUser();

    expect(first).toBe(second);
    expect(jwtDecode).toHaveBeenCalledTimes(1);
  });

  it("should handle decoded token not object", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer t",
    });
    (jwtDecode as jest.Mock).mockReturnValue("string");

    const res = await repo.getCurrentUser();
    expect(res).toBeNull();
  });

  it("should normalize scopes removing falsy values", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer t",
    });
    (jwtDecode as jest.Mock).mockReturnValue({
      scopes: [null, "OneWayReports.a", ""],
    });

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toEqual(["OneWayReports.a"]);
  });

  it("private helpers: getAuthorizationToken, decodeJwtToken, extractCountry", () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "tok",
      country: "ZZ",
    });
    (jwtDecode as jest.Mock).mockReturnValue({ country: "AA" });

    const token = (repo as any).getAuthorizationToken();
    expect(token).toBe("tok");

    const decoded = (repo as any).decodeJwtToken("Bearer abc");
    expect(decoded).toEqual({ country: "AA" });

    // when decoded has no country, fallback to headerContext
    (jwtDecode as jest.Mock).mockReturnValue({});
    const c = (repo as any).extractCountry({});
    expect(c).toBe("ZZ");
  });

  it("getCurrentUser catch block when extractUserFromToken throws", async () => {
    jest.spyOn(repo as any, "extractUserFromToken").mockImplementation(() => {
      throw new Error("boom");
    });
    const res = await repo.getCurrentUser();
    expect(res).toBeNull();
  });

  it("should handle missing scopes in decoded token (line 107)", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer t",
    });
    (jwtDecode as jest.Mock).mockReturnValue({ country: "BR" }); // no scopes property

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toEqual([]);
  });

  it("should handle falsy scopes value normalizeScopes (line 120)", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer t",
    });
    (jwtDecode as jest.Mock).mockReturnValue({ scopes: null, country: "BR" }); // scopes is null

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toEqual([]);
  });

  it("should handle empty string scopes (line 120 falsy branch)", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer t",
    });
    (jwtDecode as jest.Mock).mockReturnValue({ scopes: "", country: "BR" }); // scopes is empty string (falsy)

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toEqual([]);
  });

  it("should normalize scopes when single truthy string that becomes falsy after wrap (covers line 120 [].filter branch)", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer t",
    });
    // Test with a string that is truthy but when wrapped [scopes].filter(Boolean) checks each element
    (jwtDecode as jest.Mock).mockReturnValue({
      scopes: "OneWayReports.test",
      country: "BR",
    });

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toEqual(["OneWayReports.test"]);
  });

  it("should normalize scopes with number value that is truthy (covers line 120 truthy branch)", async () => {
    headerContextService.getHeaderContext.mockReturnValue({
      authorization: "Bearer t",
    });
    (jwtDecode as jest.Mock).mockReturnValue({ scopes: 0, country: "BR" }); // falsy number

    const res = await repo.getCurrentUser();
    expect(res).not.toBeNull();
    expect(res!.getScopes()).toEqual([]);
  });

  it("direct test of normalizeScopes with various values to cover all branches", () => {
    // Test with empty array
    expect((repo as any).normalizeScopes([])).toEqual([]);

    // Test with array containing falsy values
    expect((repo as any).normalizeScopes([null, "a", undefined])).toEqual([
      "a",
    ]);

    // Test with truthy string (not array)
    expect((repo as any).normalizeScopes("scope")).toEqual(["scope"]);

    // Test with falsy string (not array)
    expect((repo as any).normalizeScopes("")).toEqual([]);

    // Test with 0 (falsy)
    expect((repo as any).normalizeScopes(0)).toEqual([]);

    // Test with false (falsy)
    expect((repo as any).normalizeScopes(false)).toEqual([]);
  });
});
