import { FormatPeriodRangeCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatPeriodRangeCommand";

describe("FormatPeriodRangeCommand", () => {
  const command = new FormatPeriodRangeCommand();

  it("formats a month range with the year on the end month", () => {
    expect(
      command.execute("2026-01-01T00:00:00.000Z", "2026-03-31T00:00:00.000Z"),
    ).toBe("Jan-Mar'26");
  });

  it("formats a single month when the dates are in the same month", () => {
    expect(
      command.execute("2026-03-01T00:00:00.000Z", "2026-03-31T00:00:00.000Z"),
    ).toBe("Mar'26");
  });

  it("returns a dash for invalid dates", () => {
    expect(command.execute(null, "2026-03-31T00:00:00.000Z")).toBe("-");
    expect(command.execute("bad", "2026-03-31T00:00:00.000Z")).toBe("-");
  });
});
