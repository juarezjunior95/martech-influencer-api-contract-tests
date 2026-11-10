import { FormatPeriodCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatPeriodCommand";

describe("FormatPeriodCommand", () => {
  const command = new FormatPeriodCommand();
  it("should format valid date strings to Mon'YY", () => {
    expect(command.execute("2024-01-01")).toBe("Jan'24");
    expect(command.execute("2023-12-31")).toBe("Dec'23");
  });

  it("should return undefined for invalid date strings or non-strings", () => {
    expect(command.execute("invalid")).toBeUndefined();
    expect(command.execute(null)).toBeUndefined();
    expect(command.execute(123 as any)).toBeUndefined();
  });
});
