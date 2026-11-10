import { FormatLyPeriodCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatLyPeriodCommand";

describe("FormatLyPeriodCommand", () => {
  const command = new FormatLyPeriodCommand();
  it("should return period for the previous year", () => {
    expect(command.execute("2024-03-01")).toBe("Mar'23");
    expect(command.execute("2024-01-01")).toBe("Jan'23");
  });

  it("should return undefined for invalid inputs", () => {
    expect(command.execute(null as any)).toBeUndefined();
    expect(command.execute("invalid-date")).toBeUndefined();
  });
});
