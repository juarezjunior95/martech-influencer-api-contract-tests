import { FormatValueCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatValueCommand";

describe("FormatValueCommand", () => {
  const command = new FormatValueCommand();

  describe("default (string formatting)", () => {
    it("should format valid numbers with commas and one decimal place", () => {
      expect(command.execute(1234.56)).toBe("1,234.6");
      expect(command.execute(1000)).toBe("1,000.0");
      expect(command.execute("1234.56")).toBe("1,234.6");
      expect(command.execute("1000")).toBe("1,000.0");
    });

    it("should return '-' for invalid inputs", () => {
      expect(command.execute(null as any)).toBe("-");
      expect(command.execute(undefined as any)).toBe("-");
      expect(command.execute("invalid" as any)).toBe("-");
      expect(command.execute(NaN)).toBe("-");
    });
  });

  describe('returnType: "number"', () => {
    it("should return the raw number when valid", () => {
      expect(command.execute(1234.56, "number")).toBe(1234.56);
      expect(command.execute(0, "number")).toBe(0);
      expect(command.execute(-5.3, "number")).toBe(-5.3);
    });

    it("should convert string numbers to number", () => {
      expect(command.execute("1234.56", "number")).toBe(1234.56);
      expect(command.execute("0", "number")).toBe(0);
    });

    it("should return '-' for invalid inputs", () => {
      expect(command.execute(null as any, "number")).toBe("-");
      expect(command.execute(undefined as any, "number")).toBe("-");
      expect(command.execute("invalid" as any, "number")).toBe("-");
      expect(command.execute(NaN, "number")).toBe("-");
    });
  });

  describe('returnType: "string" (explicit)', () => {
    it("should behave the same as default", () => {
      expect(command.execute(1234.56, "string")).toBe("1,234.6");
      expect(command.execute(null as any, "string")).toBe("-");
    });
  });
});
