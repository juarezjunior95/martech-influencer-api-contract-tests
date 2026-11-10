import fs from "fs";
import path from "path";
import jsonata from "jsonata";

describe("Connections and Creativity Home Big Numbers Trend Formatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/connections-and-creativity/home/big-numbers-trend.jsonata",
  );
  const formatter = jsonata(fs.readFileSync(jsonataPath, "utf8"));

  type MediaSpendEntry = {
    refreshMonthLabel: string;
    vs_ly_label_suffix: string;
    ac_vs_ly: number | null;
    variationDirectionVsLy: string;
    lyMonthLabel: string;
    ac: number | null;
  };

  type NonWorkingMoneyEntry = {
    refreshMonthLabel: string;
    vs_ly_label_suffix: string;
    ac_vs_ly: number | null;
    variationDirectionVsLy: string;
    lyMonthLabel: string;
    ac: number | null;
  };

  const createMediaSpendEntry = (
    overrides: Partial<MediaSpendEntry> = {},
  ): MediaSpendEntry => ({
    refreshMonthLabel: "Dec'25",
    vs_ly_label_suffix: "YTD",
    ac_vs_ly: 5.2,
    variationDirectionVsLy: "up",
    lyMonthLabel: "Dec'24",
    ac: 12345.6,
    ...overrides,
  });

  const createNonWorkingMoneyEntry = (
    overrides: Partial<NonWorkingMoneyEntry> = {},
  ): NonWorkingMoneyEntry => ({
    refreshMonthLabel: "Dec'25",
    vs_ly_label_suffix: "YTD",
    ac_vs_ly: 3.8,
    variationDirectionVsLy: "down",
    lyMonthLabel: "Dec'24",
    ac: 8765.4,
    ...overrides,
  });

  const evaluate = (
    mediaSpendData: MediaSpendEntry[] = [],
    nonWorkingMoneyData: NonWorkingMoneyEntry[] = [],
  ) =>
    formatter.evaluate({
      datasources: {
        "media-spend": mediaSpendData,
        "non-working-money": nonWorkingMoneyData,
      },
    });

  describe("Basic structure", () => {
    it("should return an array with two objects", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry()],
        [createNonWorkingMoneyEntry()],
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it("should have correct chart titles", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry()],
        [createNonWorkingMoneyEntry()],
      );

      expect(result[0].chartTitle).toBe("Media Spend");
      expect(result[1].chartTitle).toBe("Non-Working Money");
    });
  });

  describe("Media Spend Big Number", () => {
    it("should format chartPeriod correctly", async () => {
      const result: any = await evaluate(
        [
          createMediaSpendEntry({
            refreshMonthLabel: "Dec'25",
            vs_ly_label_suffix: "YTD",
          }),
        ],
        [],
      );

      expect(result[0].chartPeriod).toBe("Dec'25 YTD");
    });

    it("should format bigNumber correctly", async () => {
      const result: any = await evaluate(
        [
          createMediaSpendEntry({
            ac_vs_ly: 5.2,
            variationDirectionVsLy: "up",
          }),
        ],
        [],
      );

      const bigNumber = result[0].bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("5.2");
      expect(bigNumber.measure).toBe("%");
      expect(bigNumber.trend).toBe("positive");
    });

    it("should format comparison correctly", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry({ lyMonthLabel: "Dec'24" })],
        [],
      );

      const comparison = result[0].bigNumberData[0].comparison;

      expect(comparison.label).toBe("vs");
      expect(comparison.value).toBe("LY");
    });

    it("should format secondaryInfo correctly", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry({ ac: 12345.6 })],
        [],
      );

      const secondaryInfo = result[0].bigNumberData[0].secondaryInfo;

      expect(secondaryInfo.label).toBe("[ # ]");
      expect(secondaryInfo.value).toBe("12,345.6");
    });
  });

  describe("Non-Working Money Big Number", () => {
    it("should format chartPeriod correctly", async () => {
      const result: any = await evaluate(
        [],
        [
          createNonWorkingMoneyEntry({
            refreshMonthLabel: "Nov'25",
            vs_ly_label_suffix: "MTD",
          }),
        ],
      );

      expect(result[1].chartPeriod).toBe("Nov'25 MTD");
    });

    it("should format bigNumber correctly", async () => {
      const result: any = await evaluate(
        [],
        [
          createNonWorkingMoneyEntry({
            ac_vs_ly: 3.8,
            variationDirectionVsLy: "down",
          }),
        ],
      );

      const bigNumber = result[1].bigNumberData[0].bigNumber;

      expect(bigNumber.value).toBe("3.8");
      expect(bigNumber.measure).toBe("%");
      expect(bigNumber.trend).toBe("positive");
    });

    it("should format comparison correctly", async () => {
      const result: any = await evaluate(
        [],
        [createNonWorkingMoneyEntry({ lyMonthLabel: "Nov'24" })],
      );

      const comparison = result[1].bigNumberData[0].comparison;

      expect(comparison.label).toBe("vs");
      expect(comparison.value).toBe("LY");
    });

    it("should format secondaryInfo correctly", async () => {
      const result: any = await evaluate(
        [],
        [createNonWorkingMoneyEntry({ ac: 8765.4 })],
      );

      const secondaryInfo = result[1].bigNumberData[0].secondaryInfo;

      expect(secondaryInfo.label).toBe("[ # ]");
      expect(secondaryInfo.value).toBe("8,765.4");
    });
  });

  describe("Trend mapping", () => {
    describe("Media Spend (standard trend)", () => {
      it("should map 'up' direction to 'positive' trend", async () => {
        const result: any = await evaluate(
          [createMediaSpendEntry({ variationDirectionVsLy: "up" })],
          [],
        );

        expect(result[0].bigNumberData[0].bigNumber.trend).toBe("positive");
      });

      it("should map 'down' direction to 'negative' trend", async () => {
        const result: any = await evaluate(
          [createMediaSpendEntry({ variationDirectionVsLy: "down" })],
          [],
        );

        expect(result[0].bigNumberData[0].bigNumber.trend).toBe("negative");
      });
    });

    describe("Non-Working Money (inverted trend - down is positive)", () => {
      it("should map 'down' direction to 'positive' trend", async () => {
        const result: any = await evaluate(
          [],
          [createNonWorkingMoneyEntry({ variationDirectionVsLy: "down" })],
        );

        expect(result[1].bigNumberData[0].bigNumber.trend).toBe("positive");
      });

      it("should map 'up' direction to 'negative' trend", async () => {
        const result: any = await evaluate(
          [],
          [createNonWorkingMoneyEntry({ variationDirectionVsLy: "up" })],
        );

        expect(result[1].bigNumberData[0].bigNumber.trend).toBe("negative");
      });
    });
  });

  describe("Value formatting", () => {
    it("should format numbers with thousands separator", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry({ ac: 1234567.8 })],
        [],
      );

      expect(result[0].bigNumberData[0].secondaryInfo.value).toBe(
        "1,234,567.8",
      );
    });

    it("should return '-' for null ac_vs_ly values", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry({ ac_vs_ly: null })],
        [createNonWorkingMoneyEntry({ ac_vs_ly: null })],
      );

      expect(result[0].bigNumberData[0].bigNumber.value).toBe("-");
      expect(result[1].bigNumberData[0].bigNumber.value).toBe("-");
    });

    it("should return '-' for null ac values", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry({ ac: null })],
        [createNonWorkingMoneyEntry({ ac: null })],
      );

      expect(result[0].bigNumberData[0].secondaryInfo.value).toBe("-");
      expect(result[1].bigNumberData[0].secondaryInfo.value).toBe("-");
    });

    it("should handle negative values correctly", async () => {
      const result: any = await evaluate(
        [createMediaSpendEntry({ ac_vs_ly: -5.5 })],
        [createNonWorkingMoneyEntry({ ac_vs_ly: -3.2 })],
      );

      expect(result[0].bigNumberData[0].bigNumber.value).toBe("-5.5");
      expect(result[1].bigNumberData[0].bigNumber.value).toBe("-3.2");
    });
  });

  describe("Empty datasources", () => {
    it("should return empty bigNumberData when media-spend datasource is empty", async () => {
      const result: any = await evaluate([], [createNonWorkingMoneyEntry()]);

      expect(result[0].bigNumberData).toEqual([]);
    });

    it("should return empty bigNumberData when non-working-money datasource is empty", async () => {
      const result: any = await evaluate([createMediaSpendEntry()], []);

      expect(result[1].bigNumberData).toEqual([]);
    });

    it("should handle both empty datasources", async () => {
      const result: any = await evaluate([], []);

      expect(result[0].bigNumberData).toEqual([]);
      expect(result[1].bigNumberData).toEqual([]);
    });
  });

  describe("Uses first record from datasource", () => {
    it("should use the first record from media-spend datasource", async () => {
      const result: any = await evaluate(
        [
          createMediaSpendEntry({ ac_vs_ly: 5.2, refreshMonthLabel: "Dec'25" }),
          createMediaSpendEntry({ ac_vs_ly: 3.1, refreshMonthLabel: "Nov'25" }),
        ],
        [],
      );

      expect(result[0].bigNumberData[0].bigNumber.value).toBe("5.2");
      expect(result[0].chartPeriod).toContain("Dec'25");
    });

    it("should use the first record from non-working-money datasource", async () => {
      const result: any = await evaluate(
        [],
        [
          createNonWorkingMoneyEntry({
            ac_vs_ly: 3.8,
            refreshMonthLabel: "Dec'25",
          }),
          createNonWorkingMoneyEntry({
            ac_vs_ly: 2.5,
            refreshMonthLabel: "Nov'25",
          }),
        ],
      );

      expect(result[1].bigNumberData[0].bigNumber.value).toBe("3.8");
      expect(result[1].chartPeriod).toContain("Dec'25");
    });
  });
});
