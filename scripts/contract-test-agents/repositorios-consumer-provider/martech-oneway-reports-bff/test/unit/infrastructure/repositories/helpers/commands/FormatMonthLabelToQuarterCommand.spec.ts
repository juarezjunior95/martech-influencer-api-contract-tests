import { FormatMonthLabelToQuarterCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatMonthLabelToQuarterCommand";

describe("FormatMonthLabelToQuarterCommand", () => {
  const command = new FormatMonthLabelToQuarterCommand();

  it("should format Q1 months correctly", () => {
    expect(command.execute("Jan'26")).toBe("Q1'26");
    expect(command.execute("Feb'25")).toBe("Q1'25");
    expect(command.execute("Mar'24")).toBe("Q1'24");
  });

  it("should format Q2 months correctly", () => {
    expect(command.execute("Apr'26")).toBe("Q2'26");
    expect(command.execute("May'25")).toBe("Q2'25");
    expect(command.execute("Jun'24")).toBe("Q2'24");
  });

  it("should format Q3 months correctly", () => {
    expect(command.execute("Jul'26")).toBe("Q3'26");
    expect(command.execute("Aug'25")).toBe("Q3'25");
    expect(command.execute("Sep'24")).toBe("Q3'24");
  });

  it("should format Q4 months correctly", () => {
    expect(command.execute("Oct'26")).toBe("Q4'26");
    expect(command.execute("Nov'25")).toBe("Q4'25");
    expect(command.execute("Dec'24")).toBe("Q4'24");
  });

  it("should return empty string for null/undefined/empty", () => {
    expect(command.execute(null)).toBe("");
    expect(command.execute(undefined)).toBe("");
    expect(command.execute("")).toBe("");
  });

  it("should return empty string for invalid format", () => {
    expect(command.execute("Invalid")).toBe("");
    expect(command.execute("2024-01-15")).toBe("");
    expect(command.execute("January'26")).toBe("");
  });

  it("should handle case-insensitive month abbreviations", () => {
    expect(command.execute("jan'26")).toBe("Q1'26");
    expect(command.execute("JAN'26")).toBe("Q1'26");
    expect(command.execute("Jan'26")).toBe("Q1'26");
  });
});
