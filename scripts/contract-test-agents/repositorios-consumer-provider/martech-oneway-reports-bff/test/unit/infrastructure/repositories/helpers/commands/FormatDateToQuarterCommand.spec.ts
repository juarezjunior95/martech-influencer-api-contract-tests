import { FormatDateToQuarterCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatDateToQuarterCommand";

describe("FormatDateToQuarterCommand", () => {
  const command = new FormatDateToQuarterCommand();
  it("should format valid dates to Qx'YY", () => {
    expect(command.execute("2024-01-15")).toBe("Q1'24");
    expect(command.execute("2024-05-20")).toBe("Q2'24");
    expect(command.execute("2024-08-10")).toBe("Q3'24");
    expect(command.execute("2024-11-05")).toBe("Q4'24");
  });

  it("should return '-' for invalid inputs", () => {
    expect(command.execute(null as any)).toBe("-");
    expect(command.execute("invalid-date")).toBe("-");
    expect(command.execute("01/01/2024")).toBe("-");
  });
});
