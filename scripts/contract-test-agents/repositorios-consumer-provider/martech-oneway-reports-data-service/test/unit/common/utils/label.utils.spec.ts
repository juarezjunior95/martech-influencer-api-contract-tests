import {
  labelVsLq,
  labelVsLy,
  labelRefresh,
  labelVsLyMonth,
} from "@common/utils/label.utils";

describe("labelVsLq", () => {
  it("should generate label for Q1", () => {
    // Act
    const result = labelVsLq({
      dtIni: "2024-01-01",
      dtEnd: "2024-03-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Q4'23");
  });

  it("should generate label for Q2", () => {
    // Act
    const result = labelVsLq({
      dtIni: "2024-05-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Q1'24");
  });

  it("should generate label with full year", () => {
    // Act
    const result = labelVsLq({
      dtIni: "2024-05-01",
      dtEnd: "2024-06-30",
      yearFormat: "full",
    });

    // Assert
    expect(result).toBe("vs Q1'2024");
  });

  it("should return empty string for empty dtIni", () => {
    // Act
    const result = labelVsLq({
      dtIni: "",
      dtEnd: "2024-03-31",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should return empty string for empty dtEnd", () => {
    // Act
    const result = labelVsLq({
      dtIni: "2024-01-01",
      dtEnd: "",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should return empty string for invalid dates", () => {
    // Act
    const result = labelVsLq({
      dtIni: "invalid",
      dtEnd: "invalid",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should handle year boundary correctly", () => {
    // Act
    const result = labelVsLq({
      dtIni: "2024-01-01",
      dtEnd: "2024-03-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Q4'23");
  });
});

describe("labelVsLy", () => {
  it("should generate label for Q1", () => {
    // Act
    const result = labelVsLy({
      dtIni: "2024-02-01",
      dtEnd: "2024-03-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Q1'23");
  });

  it("should generate label for Q2", () => {
    // Act
    const result = labelVsLy({
      dtIni: "2024-05-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Q2'23");
  });

  it("should generate label with full year", () => {
    // Act
    const result = labelVsLy({
      dtIni: "2024-05-01",
      dtEnd: "2024-06-30",
      yearFormat: "full",
    });

    // Assert
    expect(result).toBe("vs Q2'2023");
  });

  it("should generate FY label for full year range", () => {
    // Act
    const result = labelVsLy({
      dtIni: "2024-01-01",
      dtEnd: "2024-12-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs FY'23");
  });

  it("should return empty string for empty dtIni", () => {
    // Act
    const result = labelVsLy({
      dtIni: "",
      dtEnd: "2024-03-31",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should return empty string for empty dtEnd", () => {
    // Act
    const result = labelVsLy({
      dtIni: "2024-01-01",
      dtEnd: "",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should return empty string for invalid dates", () => {
    // Act
    const result = labelVsLy({
      dtIni: "invalid",
      dtEnd: "invalid",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should pass periodFormatParams correctly", () => {
    // Act
    const result = labelVsLy({
      dtIni: "2024-04-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
      periodFormatParams: {
        alwaysUseQuarter: true,
      },
    });

    // Assert
    expect(result).toBe("vs Q2'23");
  });
});

describe("labelRefresh", () => {
  it("should generate refresh label for Q1", () => {
    // Act
    const result = labelRefresh({
      dtIni: "2024-02-01",
      dtEnd: "2024-03-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("Q1'24");
  });

  it("should generate refresh label for Q2", () => {
    // Act
    const result = labelRefresh({
      dtIni: "2024-05-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("Q2'24");
  });

  it("should generate refresh label with full year", () => {
    // Act
    const result = labelRefresh({
      dtIni: "2024-05-01",
      dtEnd: "2024-06-30",
      yearFormat: "full",
    });

    // Assert
    expect(result).toBe("Q2'2024");
  });

  it("should generate FY label for full year range", () => {
    // Act
    const result = labelRefresh({
      dtIni: "2024-01-01",
      dtEnd: "2024-12-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("FY'24");
  });

  it("should return empty string for empty dtIni", () => {
    // Act
    const result = labelRefresh({
      dtIni: "",
      dtEnd: "2024-03-31",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should return empty string for empty dtEnd", () => {
    // Act
    const result = labelRefresh({
      dtIni: "2024-01-01",
      dtEnd: "",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should return empty string for invalid dates", () => {
    // Act
    const result = labelRefresh({
      dtIni: "invalid",
      dtEnd: "invalid",
    });

    // Assert
    expect(result).toBe("");
  });
});

describe("labelVsLyMonth", () => {
  it("should generate label for January", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-01-01",
      dtEnd: "2024-01-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Jan'23");
  });

  it("should generate label for June", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-06-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Jun'23");
  });

  it("should generate label with full year", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-06-01",
      dtEnd: "2024-06-30",
      yearFormat: "full",
    });

    // Assert
    expect(result).toBe("vs Jun'2023");
  });

  it("should use custom prefix", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-06-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
      prefix: "versus ",
    });

    // Assert
    expect(result).toBe("versus Jun'23");
  });

  it("should use custom suffix", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-06-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
      suffix: "LY",
    });

    // Assert
    expect(result).toBe("vs Jun'23LY");
  });

  it("should use both custom prefix and suffix", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-06-01",
      dtEnd: "2024-06-30",
      yearFormat: "short",
      prefix: "compared to ",
      suffix: " last year",
    });

    // Assert
    expect(result).toBe("compared to Jun'23 last year");
  });

  it("should return empty string for empty dtEnd", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-01-01",
      dtEnd: "",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should return empty string for invalid date", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-01-01",
      dtEnd: "invalid",
    });

    // Assert
    expect(result).toBe("");
  });

  it("should handle December correctly", () => {
    // Act
    const result = labelVsLyMonth({
      dtIni: "2024-12-01",
      dtEnd: "2024-12-31",
      yearFormat: "short",
    });

    // Assert
    expect(result).toBe("vs Dec'23");
  });
});
