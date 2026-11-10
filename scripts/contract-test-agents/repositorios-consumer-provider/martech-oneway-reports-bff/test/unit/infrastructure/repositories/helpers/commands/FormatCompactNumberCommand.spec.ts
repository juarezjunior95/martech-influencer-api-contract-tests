import { FormatCompactNumberCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatCompactNumberCommand";

describe("FormatCompactNumberCommand", () => {
  const command = new FormatCompactNumberCommand();
  it("should format large numbers with suffixes", () => {
    expect(command.execute(1500)).toBe("1.5K");
    expect(command.execute(2500000)).toBe("2.5M");
    expect(command.execute(3500000000)).toBe("3.5B");
  });

  it("should format small numbers normally", () => {
    expect(command.execute(123)).toBe("123.0");
    expect(command.execute(0)).toBe("0.0");
  });

  it("should handle negative numbers", () => {
    expect(command.execute(-1500)).toBe("-1.5K");
  });

  it("should return '-' for invalid inputs", () => {
    expect(command.execute(null as any)).toBe("-");
    expect(command.execute("invalid" as any)).toBe("-");
  });
});
