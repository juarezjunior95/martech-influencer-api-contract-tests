import {
  formatPeriod,
  appendYearIfRequested,
  normalizePeriodFilterValue,
} from "@common/utils/period.utils";

describe("formatPeriod", () => {
  describe("basic quarter detection", () => {
    it("should return Q1 for dates in first quarter with short interval", () => {
      // Act
      const result = formatPeriod("2024-02-01", "2024-03-31");

      // Assert
      expect(result).toBe("Q1");
    });

    it("should return Q2 for dates in second quarter with short interval", () => {
      // Act
      const result = formatPeriod("2024-05-01", "2024-06-30");

      // Assert
      expect(result).toBe("Q2");
    });

    it("should return Q3 for dates in third quarter with short interval", () => {
      // Act
      const result = formatPeriod("2024-08-01", "2024-09-30");

      // Assert
      expect(result).toBe("Q3");
    });

    it("should return Q4 for dates in fourth quarter with short interval", () => {
      // Act
      const result = formatPeriod("2024-11-01", "2024-12-31");

      // Assert
      expect(result).toBe("Q4");
    });
  });

  describe("FY detection", () => {
    it("should return FY when interval is 3+ months", () => {
      // Act
      const result = formatPeriod("2024-01-01", "2024-12-31");

      // Assert
      expect(result).toBe("FY");
    });

    it("should return FY for exactly 3 months difference", () => {
      // Act (January 1 to April 1 = 3 months)
      const result = formatPeriod("2024-01-01", "2024-04-01");

      // Assert
      expect(result).toBe("FY");
    });

    it("should return quarter for less than 3 months", () => {
      // Act (February 1 to March 31 = 1 month)
      const result = formatPeriod("2024-02-01", "2024-03-31");

      // Assert
      expect(result).toBe("Q1");
    });
  });

  describe("alwaysUseQuarter option", () => {
    it("should always return quarter when alwaysUseQuarter is true", () => {
      // Act
      const result = formatPeriod("2024-01-01", "2024-12-31", {
        alwaysUseQuarter: true,
      });

      // Assert
      expect(result).toBe("Q4");
    });

    it("should use quarter from end date", () => {
      // Act
      const result1 = formatPeriod("2024-01-01", "2024-03-31", {
        alwaysUseQuarter: true,
      });
      const result2 = formatPeriod("2024-01-01", "2024-06-30", {
        alwaysUseQuarter: true,
      });

      // Assert
      expect(result1).toBe("Q1");
      expect(result2).toBe("Q2");
    });
  });

  describe("useCumulativeQuarter option", () => {
    it("should return Q1 for first quarter", () => {
      // Act
      const result = formatPeriod("2024-01-01", "2024-03-31", {
        useCumulativeQuarter: true,
      });

      // Assert
      expect(result).toBe("Q1");
    });

    it("should return H1 for second quarter", () => {
      // Act
      const result = formatPeriod("2024-04-01", "2024-06-30", {
        useCumulativeQuarter: true,
      });

      // Assert
      expect(result).toBe("H1");
    });

    it("should return YTD for third quarter", () => {
      // Act
      const result = formatPeriod("2024-07-01", "2024-09-30", {
        useCumulativeQuarter: true,
      });

      // Assert
      expect(result).toBe("YTD");
    });

    it("should return FY for fourth quarter", () => {
      // Act
      const result = formatPeriod("2024-10-01", "2024-12-31", {
        useCumulativeQuarter: true,
      });

      // Assert
      expect(result).toBe("FY");
    });
  });

  describe("includeYear option", () => {
    it("should include short year when includeYear is true", () => {
      // Act
      const result = formatPeriod("2024-02-01", "2024-03-31", {
        includeYear: true,
      });

      // Assert
      expect(result).toBe("Q1'24");
    });

    it("should include full year when yearFormat is full", () => {
      // Act
      const result = formatPeriod("2024-02-01", "2024-03-31", {
        includeYear: true,
        yearFormat: "full",
      });

      // Assert
      expect(result).toBe("Q1'2024");
    });

    it("should not include year when includeYear is false", () => {
      // Act
      const result = formatPeriod("2024-02-01", "2024-03-31", {
        includeYear: false,
      });

      // Assert
      expect(result).toBe("Q1");
    });

    it("should include year with FY", () => {
      // Act
      const result = formatPeriod("2024-01-01", "2024-12-31", {
        includeYear: true,
      });

      // Assert
      expect(result).toBe("FY'24");
    });
  });

  describe("edge cases", () => {
    it("should return empty string for invalid start date", () => {
      // Act
      const result = formatPeriod("invalid", "2024-03-31");

      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for invalid end date", () => {
      // Act
      const result = formatPeriod("2024-01-01", "invalid");

      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for both invalid dates", () => {
      // Act
      const result = formatPeriod("invalid", "invalid");

      // Assert
      expect(result).toBe("");
    });

    it("should handle date strings with time", () => {
      // Act
      const result = formatPeriod(
        "2024-02-01T00:00:00.000Z",
        "2024-03-31T23:59:59.999Z",
      );

      // Assert
      expect(result).toBe("Q1");
    });
  });

  describe("complex scenarios", () => {
    it("should handle all options together", () => {
      // Act
      const result = formatPeriod("2024-07-01", "2024-09-30", {
        useCumulativeQuarter: true,
        includeYear: true,
        yearFormat: "full",
      });

      // Assert
      expect(result).toBe("YTD'2024");
    });

    it("should prioritize alwaysUseQuarter over other options", () => {
      // Act
      const result = formatPeriod("2024-01-01", "2024-12-31", {
        alwaysUseQuarter: true,
        useCumulativeQuarter: true,
      });

      // Assert
      expect(result).toBe("Q4");
    });
  });
});

describe("appendYearIfRequested", () => {
  const testDate = new Date("2024-06-15");

  it("should append short year when includeYear is true", () => {
    // Act
    const result = appendYearIfRequested("Q2", testDate, {
      includeYear: true,
    });

    // Assert
    expect(result).toBe("Q2'24");
  });

  it("should append full year when yearFormat is full", () => {
    // Act
    const result = appendYearIfRequested("Q2", testDate, {
      includeYear: true,
      yearFormat: "full",
    });

    // Assert
    expect(result).toBe("Q2'2024");
  });

  it("should not append year when includeYear is false", () => {
    // Act
    const result = appendYearIfRequested("Q2", testDate, {
      includeYear: false,
    });

    // Assert
    expect(result).toBe("Q2");
  });

  it("should not append year by default", () => {
    // Act
    const result = appendYearIfRequested("Q2", testDate);

    // Assert
    expect(result).toBe("Q2");
  });

  it("should work with different base strings", () => {
    // Act
    const result1 = appendYearIfRequested("FY", testDate, {
      includeYear: true,
    });
    const result2 = appendYearIfRequested("H1", testDate, {
      includeYear: true,
    });
    const result3 = appendYearIfRequested("YTD", testDate, {
      includeYear: true,
    });

    // Assert
    expect(result1).toBe("FY'24");
    expect(result2).toBe("H1'24");
    expect(result3).toBe("YTD'24");
  });
});

describe("normalizePeriodFilterValue", () => {
  it("should map ytd-month preset value Month to MTD", () => {
    expect(normalizePeriodFilterValue("Month")).toBe("MTD");
  });

  it("should keep YTD unchanged", () => {
    expect(normalizePeriodFilterValue("YTD")).toBe("YTD");
  });

  it("should trim whitespace before mapping", () => {
    expect(normalizePeriodFilterValue(" Month ")).toBe("MTD");
  });
});
