/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import * as path from "path";

describe("ViewConfigRepository", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
  });

  it("returns null when file not exists", async () => {
    jest.doMock("fs", () => ({ existsSync: () => false }));
    const {
      ViewConfigRepository: VCR,
    } = require("@infrastructure/repositories/view-config.repository");
    const repo = new VCR();

    const res = await repo.getByName("some_view");
    expect(res).toBeNull();
  });

  it("returns parsed config when module has a default export and formats view name", async () => {
    jest.doMock("fs", () => ({ existsSync: () => true }));
    const {
      ViewConfigRepository: VCR,
    } = require("@infrastructure/repositories/view-config.repository");
    const repo = new VCR();

    const mockConfig = { name: "test_view", filters: [{ name: "f1" }] };

    // replace the internal require with a jest mock so we can inspect the call arg
    const mockRequire: any = jest.fn((p: string) => ({ default: mockConfig }));
    mockRequire.resolve = jest.fn((p: string) => p);
    mockRequire.cache = {};

    (repo as any).require = mockRequire;

    const res = await repo.getByName("test_view");
    expect(res).toEqual(mockConfig);

    // ensure the formatted name (underscore -> slash) was used in the require call
    const expectedFragment = path.join("test", "view.view.js");
    const requiredArg = (mockRequire as jest.Mock).mock.calls[0][0];
    expect(requiredArg).toEqual(expect.stringContaining(expectedFragment));
  });

  it("returns parsed config when module exports the object directly", async () => {
    jest.doMock("fs", () => ({ existsSync: () => true }));
    const {
      ViewConfigRepository: VCR,
    } = require("@infrastructure/repositories/view-config.repository");
    const repo = new VCR();

    const mockConfig = { name: "raw_view", filters: [] };

    const mockRequire: any = (p: string) => mockConfig;
    mockRequire.resolve = jest.fn((p: string) => p);
    mockRequire.cache = {};

    (repo as any).require = mockRequire;

    const res = await repo.getByName("raw_view");
    expect(res).toEqual(mockConfig);
  });

  it("deletes require cache when in development mode", async () => {
    process.env.NODE_ENV = "development";
    jest.doMock("fs", () => ({ existsSync: () => true }));
    const {
      ViewConfigRepository: VCR,
    } = require("@infrastructure/repositories/view-config.repository");
    const repo = new VCR();

    const mockConfig = { name: "dev_view" };

    const mockRequire: any = (p: string) => mockConfig;
    mockRequire.resolve = (p: string) => p;
    mockRequire.cache = {};

    // compute expected config path the same way the repository does
    const formattedName = "dev_view".replaceAll("_", "/");
    const expectedPath = path.join(
      process.cwd(),
      "dist",
      "src",
      "domain",
      "config",
      "views",
      `${formattedName}.view.js`,
    );

    // put a sentinel in the cache and assert it's removed after call
    mockRequire.cache[expectedPath] = { sentinel: true };

    (repo as any).require = mockRequire;

    const res = await repo.getByName("dev_view");
    expect(res).toEqual(mockConfig);
    expect(mockRequire.cache[expectedPath]).toBeUndefined();
  });

  it("returns null when require throws an error", async () => {
    jest.doMock("fs", () => ({ existsSync: () => true }));
    const {
      ViewConfigRepository: VCR,
    } = require("@infrastructure/repositories/view-config.repository");
    const repo = new VCR();

    const mockRequire: any = () => {
      throw new Error("boom");
    };
    mockRequire.resolve = (p: string) => p;
    mockRequire.cache = {};

    (repo as any).require = mockRequire;

    const res = await repo.getByName("some_view");
    expect(res).toBeNull();
  });
});
