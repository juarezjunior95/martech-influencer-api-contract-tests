import fs from "fs";
import path from "path";
import jsonata from "jsonata";

describe("Portfolio Brand Home Formatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/home/home.jsonata",
  );
  const formatter = jsonata(fs.readFileSync(jsonataPath, "utf8"));

  describe("increase-brand-power datasource", () => {
    const evaluate = (data: object[]) =>
      formatter.evaluate({
        datasources: { "portfolio-brand_home_increase-brand-power": data },
      });

    const increaseBrandPowerData = [
      {
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-03-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        ac: 52.9,
        ac_vs_ly: null,
        vs_ly_label_suffix: "MTD",
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Mar'24",
        lyMonthLabel: "Mar'23",
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      },
      {
        dt_ini: "2024-04-01T00:00:00.000Z",
        dt_end: "2024-06-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        ac: 52.9,
        ac_vs_ly: null,
        vs_ly_label_suffix: "MTD",
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Jun'24",
        lyMonthLabel: "Jun'23",
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      },
      {
        dt_ini: "2024-07-01T00:00:00.000Z",
        dt_end: "2024-09-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        ac: 53.1,
        ac_vs_ly: null,
        vs_ly_label_suffix: "MTD",
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Sep'24",
        lyMonthLabel: "Sep'23",
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      },
      {
        dt_ini: "2025-10-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        ac: 53.4,
        ac_vs_ly: 0.6,
        vs_ly_label_suffix: "YTD",
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Dec'25",
        lyMonthLabel: "Dec'24",
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      },
    ];

    it("should format increase-brand-power data correctly", async () => {
      const result: any = await evaluate(increaseBrandPowerData);

      expect(result.title).toBe("ABI Brand Power");
      expect(result.period).toBe("Q4'25 YTD");
      expect(result.bigNumberData).toHaveLength(1);
      expect(result.bigNumberData[0].bigNumber.value).toBe("0.6");
      expect(result.bigNumberData[0].bigNumber.trend).toBe("positive");
    });

    it("should exclude items with ac_vs_ly from chartLineData", async () => {
      const result: any = await evaluate(increaseBrandPowerData);

      const dataWithVariation = increaseBrandPowerData.filter(
        (item) => item.ac_vs_ly !== null,
      );
      const expectedChartLength =
        increaseBrandPowerData.length - dataWithVariation.length;

      expect(result.chartLineData).toHaveLength(expectedChartLength);
      result.chartLineData.forEach((value: number, index: number) => {
        expect(value).toBe([52.9, 52.9, 53.1][index]);
      });
    });

    it("should format period as quarter", async () => {
      const result: any = await evaluate(increaseBrandPowerData);

      expect(result.period).toMatch(/^Q[1-4]'\d{2}\s\w+$/);
    });

    it("should not include trend when variationDirectionVsLy is empty", async () => {
      const dataWithEmptyDirection = [
        {
          ...increaseBrandPowerData[3],
          variationDirectionVsLy: "",
        },
      ];

      const result: any = await evaluate(dataWithEmptyDirection);

      expect(result.bigNumberData[0].bigNumber.trend).toBeUndefined();
    });
  });

  describe("portfolio-strategy datasource", () => {
    const evaluate = (data: object[]) =>
      formatter.evaluate({
        datasources: { "portfolio-brand_home_portfolio-strategy": data },
      });

    const portfolioStrategyData = [
      {
        kpi_name: "volume",
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-01-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        ac: 24186.6,
        ac_vs_ly: 0.3,
        vs_ly_label_suffix: "MTD",
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
        unit_of_measure: "MhL",
        comp_unit_of_measure: "%",
      },
      {
        kpi_name: "power",
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        ac: 30.8,
        ac_vs_ly: 0.7,
        vs_ly_label_suffix: "YTD",
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Dec'25",
        lyMonthLabel: "Dec'24",
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      },
    ];

    it("should return array with 2 cards", async () => {
      const result: any = await evaluate(portfolioStrategyData);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it("should split by kpi_name (volume and power)", async () => {
      const result: any = await evaluate(portfolioStrategyData);

      const volumeCard = result.find(
        (item: any) => item.title === "Megabrands Volume",
      );
      const powerCard = result.find(
        (item: any) => item.title === "Megabrands Brand Power",
      );

      expect(volumeCard).toBeDefined();
      expect(powerCard).toBeDefined();
      expect(volumeCard.bigNumberData[0].secondaryInfo.label).toContain("MhL");
      expect(powerCard.bigNumberData[0].secondaryInfo.label).toContain("%");
    });

    it("should format power period as quarter", async () => {
      const result: any = await evaluate(portfolioStrategyData);

      const powerCard = result.find(
        (item: any) => item.title === "Megabrands Brand Power",
      );
      expect(powerCard.period).toMatch(/^Q[1-4]'\d{2}\s*\w*$/);
    });
  });

  describe("target-audiences datasource", () => {
    const evaluate = (data: object[]) =>
      formatter.evaluate({
        datasources: {
          "innovation_innovation_overview_strategic-innovation-pillars": data,
        },
      });

    const targetAudiencesData = [
      {
        dt_ini: "2025-07-01T00:00:00.000Z",
        dt_end: "2025-09-01T00:00:00.000Z",
        country_iso_code_3: "ABI",
        ac: 42.5,
        ac_vs_ly: -2.5,
        vs_ly_label_suffix: "MTD",
        variationDirectionVsLy: "down",
        refreshMonthLabel: "Sep'25",
        unit_of_measure: "#",
        comp_unit_of_measure: "pp",
      },
    ];

    it("should format target-audiences data correctly", async () => {
      const result: any = await evaluate(targetAudiencesData);

      expect(result.title).toBe("Brands Superior");
      expect(result.period).toBe("Q3'25 MTD");
      expect(result.bigNumberData[0].bigNumber.value).toBe("-2.5");
      expect(result.bigNumberData[0].bigNumber.trend).toBe("negative");
    });

    it("should format period as quarter", async () => {
      const result: any = await evaluate(targetAudiencesData);

      expect(result.period).toMatch(/^Q[1-4]'\d{2}\s\w+$/);
    });
  });

  describe("empty state", () => {
    it("should return empty state when datasource is empty", async () => {
      const result: any = await formatter.evaluate({
        datasources: { "portfolio-brand_home_increase-brand-power": [] },
      });

      expect(result).toEqual({ empty: true });
    });
  });

  describe("number formatting", () => {
    it("should format positive numbers", async () => {
      const result: any = await formatter.evaluate({
        datasources: {
          "portfolio-brand_home_increase-brand-power": [
            {
              dt_ini: "2025-10-01T00:00:00.000Z",
              dt_end: "2025-12-01T00:00:00.000Z",
              ac: 53.4,
              ac_vs_ly: 0.6,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "up",
              unit_of_measure: "%",
              comp_unit_of_measure: "pp",
            },
          ],
        },
      });

      expect(result.bigNumberData[0].bigNumber.value).toBe("0.6");
    });

    it("should format zero without sign", async () => {
      const result: any = await formatter.evaluate({
        datasources: {
          "portfolio-brand_home_increase-brand-power": [
            {
              dt_ini: "2025-10-01T00:00:00.000Z",
              dt_end: "2025-12-01T00:00:00.000Z",
              ac: 53.4,
              ac_vs_ly: 0,
              vs_ly_label_suffix: "YTD",
              variationDirectionVsLy: "",
              unit_of_measure: "%",
              comp_unit_of_measure: "pp",
            },
          ],
        },
      });

      expect(result.bigNumberData[0].bigNumber.value).toBe("0.0");
    });

    it("should format negative numbers with - sign", async () => {
      const result: any = await formatter.evaluate({
        datasources: {
          "innovation_innovation_overview_strategic-innovation-pillars": [
            {
              dt_ini: "2025-07-01T00:00:00.000Z",
              dt_end: "2025-09-01T00:00:00.000Z",
              ac: 42.5,
              ac_vs_ly: -2.5,
              vs_ly_label_suffix: "MTD",
              variationDirectionVsLy: "down",
              unit_of_measure: "#",
              comp_unit_of_measure: "pp",
            },
          ],
        },
      });

      expect(result.bigNumberData[0].bigNumber.value).toMatch(/^-/);
    });
  });
});
