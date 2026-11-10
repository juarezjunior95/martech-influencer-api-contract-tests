import { formatDirection } from "@common/utils/direction.utils";

describe("formatDirection", () => {
  describe("numeric values", () => {
    it("should return 'up' for positive numbers by default", () => {
      // Act
      const result = formatDirection(5);

      // Assert
      expect(result).toBe("up");
    });

    it("should return 'down' for negative numbers by default", () => {
      // Act
      const result = formatDirection(-5);

      // Assert
      expect(result).toBe("down");
    });

    it("should return 'center' for zero when usingCenter is true", () => {
      // Act
      const result = formatDirection(0, { usingCenter: true });

      // Assert
      expect(result).toBe("center");
    });

    it("should return 'down' for zero when usingCenter is false", () => {
      // Act
      const result = formatDirection(0, { usingCenter: false });

      // Assert
      expect(result).toBe("down");
    });

    it("should return 'down' for zero by default", () => {
      // Act
      const result = formatDirection(0);

      // Assert
      expect(result).toBe("down");
    });

    it("should return 'up' for zero when positiveZero is true", () => {
      // Act
      const result = formatDirection(0, { positiveZero: true });

      // Assert
      expect(result).toBe("up");
    });
  });

  describe("string values", () => {
    it("should return 'up' for string 'G'", () => {
      // Act
      const result = formatDirection("G");

      // Assert
      expect(result).toBe("up");
    });

    it("should return 'down' for string 'R'", () => {
      // Act
      const result = formatDirection("R");

      // Assert
      expect(result).toBe("down");
    });

    it("should return 'up' for lowercase 'g'", () => {
      // Act
      const result = formatDirection("g");

      // Assert
      expect(result).toBe("up");
    });

    it("should return 'down' for lowercase 'r'", () => {
      // Act
      const result = formatDirection("r");

      // Assert
      expect(result).toBe("down");
    });

    it("should return 'center' for empty string when usingCenter is true", () => {
      // Act
      const result = formatDirection("", { usingCenter: true });

      // Assert
      expect(result).toBe("center");
    });

    it("should return empty string for empty string when usingCenter is false", () => {
      // Act
      const result = formatDirection("", { usingCenter: false });

      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for unknown string values", () => {
      // Act
      const result = formatDirection("X");

      // Assert
      expect(result).toBe("");
    });
  });

  describe("custom labels", () => {
    it("should use custom up label", () => {
      // Act
      const result = formatDirection(5, { up: "increase" });

      // Assert
      expect(result).toBe("increase");
    });

    it("should use custom down label", () => {
      // Act
      const result = formatDirection(-5, { down: "decrease" });

      // Assert
      expect(result).toBe("decrease");
    });

    it("should use custom center label", () => {
      // Act
      const result = formatDirection(0, {
        center: "neutral",
        usingCenter: true,
      });

      // Assert
      expect(result).toBe("neutral");
    });

    it("should use all custom labels together", () => {
      // Act
      const result1 = formatDirection(10, {
        up: "positive",
        down: "negative",
        center: "neutral",
      });
      const result2 = formatDirection(-10, {
        up: "positive",
        down: "negative",
        center: "neutral",
      });
      const result3 = formatDirection(0, {
        up: "positive",
        down: "negative",
        center: "neutral",
        usingCenter: true,
      });

      // Assert
      expect(result1).toBe("positive");
      expect(result2).toBe("negative");
      expect(result3).toBe("neutral");
    });
  });

  describe("invert parameter", () => {
    it("should return 'down' for positive numbers when invert is true", () => {
      // Act
      const result = formatDirection(5, { invert: true });

      // Assert
      expect(result).toBe("down");
    });

    it("should return 'up' for negative numbers when invert is true", () => {
      // Act
      const result = formatDirection(-5, { invert: true });

      // Assert
      expect(result).toBe("up");
    });

    it("should return 'down' for string 'G' when invert is true", () => {
      // Act
      const result = formatDirection("G", { invert: true });

      // Assert
      expect(result).toBe("down");
    });

    it("should return 'up' for string 'R' when invert is true", () => {
      // Act
      const result = formatDirection("R", { invert: true });

      // Assert
      expect(result).toBe("up");
    });

    it("should work with custom labels and invert", () => {
      // Act
      const result = formatDirection(5, {
        up: "good",
        down: "bad",
        invert: true,
      });

      // Assert
      expect(result).toBe("bad");
    });
  });

  describe("edge cases", () => {
    it("should return empty string for null value", () => {
      // Act
      const result = formatDirection(null as any);

      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for undefined value", () => {
      // Act
      const result = formatDirection(undefined as any);

      // Assert
      expect(result).toBe("");
    });

    it("should handle very large positive numbers", () => {
      // Act
      const result = formatDirection(999999999);

      // Assert
      expect(result).toBe("up");
    });

    it("should handle very large negative numbers", () => {
      // Act
      const result = formatDirection(-999999999);

      // Assert
      expect(result).toBe("down");
    });

    it("should handle decimal numbers", () => {
      // Act
      const result1 = formatDirection(0.5);
      const result2 = formatDirection(-0.5);

      // Assert
      expect(result1).toBe("up");
      expect(result2).toBe("down");
    });
  });

  describe("complex scenarios", () => {
    it("should handle all parameters together", () => {
      // Act
      const result = formatDirection(0, {
        up: "arrow_up",
        down: "arrow_down",
        center: "arrow_center",
        usingCenter: true,
        invert: false,
      });

      // Assert
      expect(result).toBe("arrow_center");
    });

    it("should prioritize center over invert when value is zero", () => {
      // Act
      const result = formatDirection(0, {
        up: "high",
        down: "low",
        center: "middle",
        usingCenter: true,
        invert: true,
      });

      // Assert
      expect(result).toBe("middle");
    });
  });
});
