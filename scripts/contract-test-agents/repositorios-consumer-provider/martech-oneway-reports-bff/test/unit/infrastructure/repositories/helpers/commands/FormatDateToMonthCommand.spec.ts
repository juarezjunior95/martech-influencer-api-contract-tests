import { FormatDateToMonthCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatDateToMonthCommand";

describe("FormatDateToMonthCommand", () => {
  const command = new FormatDateToMonthCommand();
  it("should format valid dates to Mon'YY", () => {
    expect(command.execute("2024-02-15")).toBe("Feb'24");
    expect(command.execute("2024-11-30")).toBe("Nov'24");
  });

  it("should return '-' for invalid inputs", () => {
    expect(command.execute(null as any)).toBe("-");
    expect(command.execute("invalid-date")).toBe("-");
    expect(command.execute("01/01/2024")).toBe("-");
  });
});
