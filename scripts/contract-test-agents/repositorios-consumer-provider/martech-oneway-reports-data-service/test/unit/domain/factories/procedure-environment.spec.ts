import { getProcedureEnvironment } from "@domain/factories/procedure-environment";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

describe("getProcedureEnvironment", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should return UAT when NODE_ENV is uat", () => {
    process.env.NODE_ENV = "uat";
    expect(getProcedureEnvironment()).toBe("UAT");
  });

  it("should return PRD for non-uat NODE_ENV", () => {
    process.env.NODE_ENV = "production";
    expect(getProcedureEnvironment()).toBe("PRD");
  });
});

describe("createDeltalakeProcedureFetchDataConfig environment", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should include environment in the procedure JSON payload", () => {
    process.env.NODE_ENV = "uat";

    const config = createDeltalakeProcedureFetchDataConfig({
      functionName: "test_function",
      parameters: ["country"],
    });

    expect(config.procedure).toContain('"environment": "UAT"');
    expect(config.procedure).toContain('"country": :country');
  });

  it("should ignore environment in staticParams and use getProcedureEnvironment", () => {
    process.env.NODE_ENV = "uat";

    const config = createDeltalakeProcedureFetchDataConfig({
      functionName: "test_function",
      parameters: [],
      staticParams: { environment: "PRD" },
    });

    expect(config.procedure).toContain('"environment": "UAT"');
  });
});
