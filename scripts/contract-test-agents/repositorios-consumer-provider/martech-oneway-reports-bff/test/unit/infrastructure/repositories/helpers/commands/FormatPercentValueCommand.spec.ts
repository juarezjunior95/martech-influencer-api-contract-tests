import { FormatPercentValueCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatPercentValueCommand";

describe("FormatPercentValueCommand", () => {
  const command = new FormatPercentValueCommand();

  it("formats numeric values with a percent suffix", () => {
    expect(command.execute(1.234)).toBe("1.2%");
    expect(command.execute("2.25")).toBe("2.3%");
  });

  it("uses the provided suffix", () => {
    expect(command.execute(0.8, "pp")).toBe("0.8pp");
  });

  it("returns a dash for invalid values", () => {
    expect(command.execute(null)).toBe("-");
    expect(command.execute(undefined)).toBe("-");
    expect(command.execute("abc")).toBe("-");
  });
});
