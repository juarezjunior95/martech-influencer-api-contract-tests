import { SafeNumberCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/SafeNumberCommand";

describe("SafeNumberCommand", () => {
  const command = new SafeNumberCommand();
  it("should return the number if input is a valid number", () => {
    expect(command.execute(10)).toBe(10);
    expect(command.execute(0)).toBe(0);
    expect(command.execute(-5)).toBe(-5);
    expect(command.execute(1.5)).toBe(1.5);
  });

  it("should return 0 for non-number inputs", () => {
    expect(command.execute(null)).toBe(0);
    expect(command.execute(undefined)).toBe(0);
    expect(command.execute("10")).toBe(10);
    expect(command.execute("3.14")).toBe(3.14);
    expect(command.execute("invalid")).toBe(0);
    expect(command.execute(NaN)).toBe(0);
    expect(command.execute({} as any)).toBe(0);
  });
});
