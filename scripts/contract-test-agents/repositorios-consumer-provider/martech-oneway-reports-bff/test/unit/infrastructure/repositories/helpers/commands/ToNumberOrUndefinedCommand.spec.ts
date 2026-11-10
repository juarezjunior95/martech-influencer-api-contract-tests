import { ToNumberOrUndefinedCommand } from "@infrastructure/repositories/helpers/commands/ToNumberOrUndefinedCommand";

describe("ToNumberOrUndefinedCommand", () => {
  const command = new ToNumberOrUndefinedCommand();

  it("should return finite numbers unchanged", () => {
    expect(command.execute(0)).toBe(0);
    expect(command.execute(1)).toBe(1);
    expect(command.execute(-3.2)).toBe(-3.2);
    expect(command.execute(1.5)).toBe(1.5);
    expect(command.execute(Number.MAX_SAFE_INTEGER)).toBe(
      Number.MAX_SAFE_INTEGER,
    );
  });

  it("should return undefined for NaN/Infinity", () => {
    expect(command.execute(NaN)).toBeUndefined();
    expect(command.execute(Infinity)).toBeUndefined();
    expect(command.execute(-Infinity)).toBeUndefined();
  });

  it("should parse valid numeric strings (trim + comma-to-dot)", () => {
    expect(command.execute("1")).toBe(1);
    expect(command.execute("-3.2")).toBe(-3.2);
    expect(command.execute("+4")).toBe(4);
    expect(command.execute("1,5")).toBe(1.5);
    expect(command.execute(" 4 ")).toBe(4);
    expect(command.execute(".5")).toBe(0.5);
    expect(command.execute("0")).toBe(0);
  });

  it("should return undefined for invalid strings", () => {
    expect(command.execute("abc")).toBeUndefined();
    expect(command.execute("")).toBeUndefined();
    expect(command.execute(" ")).toBeUndefined();
    expect(command.execute("1.2.3")).toBeUndefined();
    expect(command.execute("12px")).toBeUndefined();
    expect(command.execute("--1")).toBeUndefined();
  });

  it("should return undefined for unsupported types", () => {
    expect(command.execute(null)).toBeUndefined();
    expect(command.execute(undefined)).toBeUndefined();
    expect(command.execute({})).toBeUndefined();
    expect(command.execute([])).toBeUndefined();
    expect(command.execute([1, 2])).toBeUndefined();
    expect(command.execute(true)).toBeUndefined();
    expect(command.execute(false)).toBeUndefined();
  });
});
