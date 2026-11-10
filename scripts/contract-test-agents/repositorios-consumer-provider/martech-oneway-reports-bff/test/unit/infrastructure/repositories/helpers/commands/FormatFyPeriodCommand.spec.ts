import { FormatFyPeriodCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatFyPeriodCommand";

describe("FormatFyPeriodCommand", () => {
  const command = new FormatFyPeriodCommand();

  it("should format valid date strings to YY'FY by default (suffix)", () => {
    expect(command.execute("2023-12-01T00:00:00.000Z")).toBe("23'FY");
    expect(command.execute("2025-06-15")).toBe("25'FY");
    expect(command.execute("2024-01-01")).toBe("24'FY");
  });

  it("should format to YY'FY when format is suffix", () => {
    expect(command.execute("2025-06-15", "suffix")).toBe("25'FY");
  });

  it("should format to FY'YY when format is prefix", () => {
    expect(command.execute("2023-12-01T00:00:00.000Z", "prefix")).toBe("FY'23");
    expect(command.execute("2025-06-15", "prefix")).toBe("FY'25");
    expect(command.execute("2024-01-01", "prefix")).toBe("FY'24");
  });

  it("should return undefined for invalid date strings or non-strings", () => {
    expect(command.execute("invalid")).toBeUndefined();
    expect(command.execute(null)).toBeUndefined();
    expect(command.execute(undefined)).toBeUndefined();
    expect(command.execute("")).toBeUndefined();
    expect(command.execute(123 as any)).toBeUndefined();
  });
});
