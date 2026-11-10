import { LabelPeriodQuarterCommand } from "@infrastructure/repositories/helpers/commands/LabelPeriodQuarterCommand";

describe("LabelPeriodQuarterCommand", () => {
  const command = new LabelPeriodQuarterCommand();

  it("should format year and month to Qx'YY", () => {
    expect(command.execute(2025, 1)).toBe("Q1'25");
    expect(command.execute(2025, 3)).toBe("Q1'25");
    expect(command.execute(2025, 4)).toBe("Q2'25");
    expect(command.execute(2025, 6)).toBe("Q2'25");
    expect(command.execute(2025, 7)).toBe("Q3'25");
    expect(command.execute(2025, 9)).toBe("Q3'25");
    expect(command.execute(2025, 10)).toBe("Q4'25");
    expect(command.execute(2025, 12)).toBe("Q4'25");
    expect(command.execute(2023, 3)).toBe("Q1'23");
  });

  it("should accept string year and month", () => {
    expect(command.execute("2025", "3")).toBe("Q1'25");
    expect(command.execute(2025, "12")).toBe("Q4'25");
  });

  it("should return empty string for invalid inputs", () => {
    expect(command.execute(null as any, 1)).toBe("");
    expect(command.execute(2025, null as any)).toBe("");
    expect(command.execute(undefined as any, 1)).toBe("");
    expect(command.execute(2025, undefined as any)).toBe("");
    expect(command.execute("invalid", 1)).toBe("");
    expect(command.execute(2025, "invalid")).toBe("");
    expect(command.execute(-1, 1)).toBe("");
  });
});
