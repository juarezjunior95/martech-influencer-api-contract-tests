import { GetColorUpDownCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/GetColorUpDownCommand";

describe("GetColorUpDownCommand", () => {
  const command = new GetColorUpDownCommand();
  const UP = "#49764B";
  const DOWN = "#A20A0A";

  describe("standard rule", () => {
    it("should return up for strictly positive values", () => {
      expect(command.execute(1.2, UP, DOWN)).toBe(UP);
      expect(command.execute(0.1, UP, DOWN)).toBe(UP);
    });

    it("should return down for negative values", () => {
      expect(command.execute(-0.1, UP, DOWN)).toBe(DOWN);
      expect(command.execute(-5, UP, DOWN)).toBe(DOWN);
    });

    it("should treat zero as negative by default (strict > 0)", () => {
      expect(command.execute(0, UP, DOWN)).toBe(DOWN);
    });

    it("should treat zero as positive when includeZero is true (>= 0)", () => {
      expect(command.execute(0, UP, DOWN, { includeZero: true })).toBe(UP);
    });
  });

  describe("reverse rule", () => {
    it("should return down for positive values", () => {
      expect(command.execute(1.2, UP, DOWN, { rule: "reverse" })).toBe(DOWN);
    });

    it("should return up for negative values", () => {
      expect(command.execute(-0.5, UP, DOWN, { rule: "reverse" })).toBe(UP);
    });

    it("should treat zero as negative by default under reverse (strict > 0)", () => {
      expect(command.execute(0, UP, DOWN, { rule: "reverse" })).toBe(UP);
    });

    it("should treat zero as positive under reverse when includeZero is true", () => {
      expect(
        command.execute(0, UP, DOWN, { rule: "reverse", includeZero: true }),
      ).toBe(DOWN);
    });
  });

  describe("non-numeric values", () => {
    it("should return undefined by default for null, undefined, NaN and non-numeric strings", () => {
      expect(command.execute(null, UP, DOWN)).toBeUndefined();
      expect(command.execute(undefined, UP, DOWN)).toBeUndefined();
      expect(command.execute(NaN, UP, DOWN)).toBeUndefined();
      expect(command.execute("abc", UP, DOWN)).toBeUndefined();
    });

    it("should return configured nonNumericColor when provided", () => {
      expect(
        command.execute(null, UP, DOWN, { nonNumericColor: "neutral" }),
      ).toBe("neutral");
      expect(
        command.execute(undefined, UP, DOWN, { nonNumericColor: "#999999" }),
      ).toBe("#999999");
    });

    it("should coerce numeric strings", () => {
      expect(command.execute("2.5", UP, DOWN)).toBe(UP);
      expect(command.execute("-0.4", UP, DOWN)).toBe(DOWN);
    });
  });
});
