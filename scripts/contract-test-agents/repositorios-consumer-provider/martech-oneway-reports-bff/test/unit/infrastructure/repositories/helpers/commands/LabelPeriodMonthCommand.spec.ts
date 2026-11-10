import { LabelPeriodMonthCommand } from "@infrastructure/repositories/helpers/commands/LabelPeriodMonthCommand";

describe("LabelPeriodMonthCommand", () => {
  const command = new LabelPeriodMonthCommand();

  it("should format year and month to Mon'YY for every valid month", () => {
    expect(command.execute(2025, 1)).toBe("Jan'25");
    expect(command.execute(2025, 2)).toBe("Feb'25");
    expect(command.execute(2025, 3)).toBe("Mar'25");
    expect(command.execute(2025, 4)).toBe("Apr'25");
    expect(command.execute(2025, 5)).toBe("May'25");
    expect(command.execute(2025, 6)).toBe("Jun'25");
    expect(command.execute(2025, 7)).toBe("Jul'25");
    expect(command.execute(2025, 8)).toBe("Aug'25");
    expect(command.execute(2025, 9)).toBe("Sep'25");
    expect(command.execute(2025, 10)).toBe("Oct'25");
    expect(command.execute(2025, 11)).toBe("Nov'25");
    expect(command.execute(2025, 12)).toBe("Dec'25");
    expect(command.execute(2023, 3)).toBe("Mar'23");
  });

  it("should accept string year and month", () => {
    expect(command.execute("2025", "3")).toBe("Mar'25");
    expect(command.execute(2025, "12")).toBe("Dec'25");
    expect(command.execute("2024", 1)).toBe("Jan'24");
  });

  it("should return empty string for invalid inputs", () => {
    expect(command.execute(null as any, 1)).toBe("");
    expect(command.execute(2025, null as any)).toBe("");
    expect(command.execute(undefined as any, 1)).toBe("");
    expect(command.execute(2025, undefined as any)).toBe("");
    expect(command.execute("invalid", 1)).toBe("");
    expect(command.execute(2025, "invalid")).toBe("");
    expect(command.execute(-1, 1)).toBe("");
    expect(command.execute(2025, 0)).toBe("");
    expect(command.execute(2025, 13)).toBe("");
    expect(command.execute(2025, -1)).toBe("");
  });
});
