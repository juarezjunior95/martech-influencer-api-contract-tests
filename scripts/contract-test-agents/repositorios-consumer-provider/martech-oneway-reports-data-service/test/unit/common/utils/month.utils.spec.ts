import { formatMonth } from "@common/utils/month.utils";

describe("formatMonth", () => {
  describe("basic formatting", () => {
    it("should return month abbreviation for a valid date", () => {
      // Act
      const result = formatMonth("2024-01-15");

      // Assert
      expect(result).toBe("Jan");
    });

    it("should return correct abbreviation for each month", () => {
      // Assert - using ISO dates that are parsed as UTC
      expect(formatMonth("2024-01-15")).toBe("Jan");
      expect(formatMonth("2024-02-15")).toBe("Feb");
      expect(formatMonth("2024-03-15")).toBe("Mar");
      expect(formatMonth("2024-04-15")).toBe("Apr");
      expect(formatMonth("2024-05-15")).toBe("May");
      expect(formatMonth("2024-06-15")).toBe("Jun");
      expect(formatMonth("2024-07-15")).toBe("Jul");
      expect(formatMonth("2024-08-15")).toBe("Aug");
      expect(formatMonth("2024-09-15")).toBe("Sep");
      expect(formatMonth("2024-10-15")).toBe("Oct");
      expect(formatMonth("2024-11-15")).toBe("Nov");
      expect(formatMonth("2024-12-15")).toBe("Dec");
    });

    it("should handle different date formats", () => {
      // Act
      const result1 = formatMonth("2024-06-15");
      const result2 = formatMonth("2024-06-15T00:00:00.000Z");

      // Assert
      expect(result1).toBe("Jun");
      expect(result2).toBe("Jun");
    });
  });

  describe("includeYear option", () => {
    it("should include full year when includeYear is true", () => {
      // Act
      const result = formatMonth("2024-06-15", {
        includeYear: true,
        yearFormat: "full",
      });

      // Assert
      expect(result).toBe("Jun'2024");
    });

    it("should include short year when includeYear is true and yearFormat is short", () => {
      // Act
      const result = formatMonth("2024-06-15", {
        includeYear: true,
        yearFormat: "short",
      });

      // Assert
      expect(result).toBe("Jun'24");
    });

    it("should not include year when includeYear is false", () => {
      // Act
      const result = formatMonth("2024-06-15", { includeYear: false });

      // Assert
      expect(result).toBe("Jun");
    });

    it("should default to full year format when not specified", () => {
      // Act
      const result = formatMonth("2024-06-15", { includeYear: true });

      // Assert
      expect(result).toBe("Jun'2024");
    });
  });

  describe("usePreviousYear option", () => {
    it("should use previous year when usePreviousYear is true", () => {
      // Act
      const result = formatMonth("2024-06-15", {
        includeYear: true,
        usePreviousYear: true,
        yearFormat: "full",
      });

      // Assert
      expect(result).toBe("Jun'2023");
    });

    it("should use previous year with short format", () => {
      // Act
      const result = formatMonth("2024-06-15", {
        includeYear: true,
        usePreviousYear: true,
        yearFormat: "short",
      });

      // Assert
      expect(result).toBe("Jun'23");
    });

    it("should use current year when usePreviousYear is false", () => {
      // Act
      const result = formatMonth("2024-06-15", {
        includeYear: true,
        usePreviousYear: false,
        yearFormat: "full",
      });

      // Assert
      expect(result).toBe("Jun'2024");
    });

    it("should not affect result when includeYear is false", () => {
      // Act
      const result = formatMonth("2024-06-15", {
        includeYear: false,
        usePreviousYear: true,
      });

      // Assert
      expect(result).toBe("Jun");
    });
  });

  describe("edge cases", () => {
    it("should return empty string for empty date", () => {
      // Act
      const result = formatMonth("");

      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for invalid date", () => {
      // Act
      const result = formatMonth("invalid-date");

      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for null", () => {
      // Act
      const result = formatMonth(null as any);

      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for undefined", () => {
      // Act
      const result = formatMonth(undefined as any);

      // Assert
      expect(result).toBe("");
    });

    it("should handle date at year boundary", () => {
      // Act
      const result = formatMonth("2024-12-31", {
        includeYear: true,
        yearFormat: "short",
      });

      // Assert
      expect(result).toBe("Dec'24");
    });

    it("should handle leap year dates", () => {
      // Act
      const result = formatMonth("2024-02-29");

      // Assert
      expect(result).toBe("Feb");
    });
  });

  describe("complex scenarios", () => {
    it("should handle all options together", () => {
      // Act
      const result = formatMonth("2024-06-15", {
        includeYear: true,
        usePreviousYear: true,
        yearFormat: "short",
      });

      // Assert
      expect(result).toBe("Jun'23");
    });

    it("should handle beginning of century", () => {
      // Act
      const result = formatMonth("2000-01-15", {
        includeYear: true,
        yearFormat: "short",
      });

      // Assert
      expect(result).toBe("Jan'00");
    });

    it("should handle year 2099", () => {
      // Act
      const result = formatMonth("2099-12-31", {
        includeYear: true,
        yearFormat: "short",
      });

      // Assert
      expect(result).toBe("Dec'99");
    });
  });
});
