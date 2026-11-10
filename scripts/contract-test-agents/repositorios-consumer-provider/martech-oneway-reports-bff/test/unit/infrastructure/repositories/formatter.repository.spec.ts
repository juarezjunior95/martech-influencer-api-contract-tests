/* eslint-disable @typescript-eslint/no-require-imports */

import { FormatterRepository } from "@infrastructure/repositories/formatter.repository";

describe("FormatterRepository", () => {
  let repo: FormatterRepository;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // replace fs and jsonata via require cache mocking inside tests
  });

  it("should throw when formatter file missing", async () => {
    jest.doMock("fs", () => ({ existsSync: () => false }));
    const {
      FormatterRepository: FR,
    } = require("@infrastructure/repositories/formatter.repository");
    repo = new FR();

    await expect(repo.format("nofile", [])).rejects.toThrow(
      /Formatter file not found/,
    );
  });

  it("should load expression and evaluate", async () => {
    const fakeExpr = {
      evaluate: jest.fn().mockResolvedValue({ ok: true }),
      registerFunction: jest.fn(),
    };
    jest.doMock("fs", () => ({
      existsSync: () => true,
      readFileSync: () => "expr",
    }));
    jest.doMock("jsonata", () => jest.fn().mockReturnValue(fakeExpr));

    const {
      FormatterRepository: FR,
    } = require("@infrastructure/repositories/formatter.repository");
    repo = new FR();

    const data = [{ name: "a", data: [{ x: 1 }] }];
    const res = await repo.format("fmt", data as any);

    expect(res).toEqual({ ok: true });
  });

  it("createDatasourcesObject should create named object via format method", async () => {
    const fakeExpr = {
      evaluate: jest.fn().mockResolvedValue("RESULT"),
      registerFunction: jest.fn(),
    };
    jest.doMock("fs", () => ({
      existsSync: () => true,
      readFileSync: () => "expr",
    }));
    jest.doMock("jsonata", () => jest.fn().mockReturnValue(fakeExpr));

    const {
      FormatterRepository: FR,
    } = require("@infrastructure/repositories/formatter.repository");
    repo = new FR();

    const data = [{ name: "ds", data: [1, 2] }];
    const res = await repo.format("f", data as any);
    expect(res).toBe("RESULT");
  });

  it("should create datasources object with named data sources", async () => {
    // Explicitly don't mock fs and jsonata to use real implementations
    jest.dontMock("fs");
    jest.dontMock("jsonata");
    const {
      FormatterRepository: FR,
    } = require("@infrastructure/repositories/formatter.repository");
    repo = new FR();
    const data = [{ name: "a", title: "b", data: [{ x: 1 }] }];
    return repo.format("example/exampleEmpty", data as any).then((res) => {
      expect(res).toEqual({ datasources: { b: [{ x: 1 }] } });
    });
  });
});
