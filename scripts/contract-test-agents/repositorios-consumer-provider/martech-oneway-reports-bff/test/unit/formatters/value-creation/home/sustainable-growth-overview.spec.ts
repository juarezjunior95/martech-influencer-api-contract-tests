import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("sustainable-growth-overview formatter (value-creation home)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/home/sustainable-growth-overview.jsonata",
  );

  type GrowthRow = {
    kpi_name: string;
    dt_ini: string;
    dt_end: string;
    ac: number;
    ac_vs_ly: number;
    ac_vs_bu: number;
    variationDirectionVsLy: string;
    variationDirectionVsBu?: string;
    comp_unit_of_measure?: string;
    unit_of_measure?: string;
    period?: string;
    average_line?: number;
    variationDirectionAverageLine?: string;
  };

  const createMockInput = (opts: {
    volume?: GrowthRow[];
    finance?: GrowthRow[];
    netRevenue?: GrowthRow[];
    cores?: GrowthRow[];
    marketShare?: GrowthRow[];
    brandPower?: GrowthRow[];
  }) => ({
    datasources: {
      volume: opts.volume ?? [],
      finance: opts.finance ?? [
        ...(opts.netRevenue ?? []),
        ...(opts.cores ?? []),
      ],
      marketShare: opts.marketShare ?? [],
      brandPower: opts.brandPower ?? [],
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  describe("financial vs non-financial data", () => {
    it("financial KPI (volume) has highlighted bars (stripedIndexes) and non-financial (marketShare) does not", async () => {
      const volumeRows: GrowthRow[] = [
        {
          kpi_name: "volume",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-03-31T00:00:00.000Z",
          ac: 100,
          ac_vs_ly: 5,
          ac_vs_bu: 2,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "up",
          comp_unit_of_measure: "%",
          unit_of_measure: "hl",
          period: "Q1",
          average_line: 3,
          variationDirectionAverageLine: "up",
        },
        {
          kpi_name: "volume",
          dt_ini: "2025-04-01T00:00:00.000Z",
          dt_end: "2025-06-30T00:00:00.000Z",
          ac: 110,
          ac_vs_ly: 4,
          ac_vs_bu: 1,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "down",
          comp_unit_of_measure: "%",
          unit_of_measure: "hl",
          period: "Q2",
          average_line: 3.5,
          variationDirectionAverageLine: "up",
        },
        {
          kpi_name: "volume",
          dt_ini: "2025-07-01T00:00:00.000Z",
          dt_end: "2025-09-30T00:00:00.000Z",
          ac: 120,
          ac_vs_ly: 6,
          ac_vs_bu: 3,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "up",
          comp_unit_of_measure: "%",
          unit_of_measure: "hl",
          period: "Q3",
          average_line: 4,
          variationDirectionAverageLine: "down",
        },
      ];

      const marketShareRows: GrowthRow[] = [
        {
          kpi_name: "market_share",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-03-31T00:00:00.000Z",
          ac: 22.5,
          ac_vs_ly: 1.2,
          ac_vs_bu: 0,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
        },
        {
          kpi_name: "market_share",
          dt_ini: "2025-04-01T00:00:00.000Z",
          dt_end: "2025-06-30T00:00:00.000Z",
          ac: 23,
          ac_vs_ly: 0.8,
          ac_vs_bu: 0,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
        },
      ];

      const result = await evaluateExpression(
        createMockInput({ volume: volumeRows, marketShare: marketShareRows }),
      );

      expect(result).toBeDefined();
      expect(result.volume).toBeDefined();
      expect(result.marketShare).toBeDefined();

      expect(result.volume.barChart).toBeDefined();
      expect(result.volume.barChart.stripedIndexes).toBeDefined();
      expect(result.volume.barChart.stripedIndexes).toEqual([1]);

      expect(result.marketShare.barChart).toBeDefined();
      expect(result.marketShare.barChart.stripedIndexes).toBeUndefined();
    });

    it("financial KPI has prefix in roundedArrow and non-financial does not", async () => {
      const netRevenueRows: GrowthRow[] = [
        {
          kpi_name: "nr",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac: 1000,
          ac_vs_ly: 8,
          ac_vs_bu: 5,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "up",
          comp_unit_of_measure: "%",
          unit_of_measure: "$Mio",
          period: "YTD",
          average_line: 6,
          variationDirectionAverageLine: "up",
        },
      ];

      const brandPowerRows: GrowthRow[] = [
        {
          kpi_name: "power",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac: 75,
          ac_vs_ly: 2,
          ac_vs_bu: 0,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "%",
        },
      ];

      const result = await evaluateExpression(
        createMockInput({
          netRevenue: netRevenueRows,
          brandPower: brandPowerRows,
        }),
      );

      expect(result.netRevenue).toBeDefined();
      expect(result.netRevenue.barChart).toBeDefined();
      expect(result.netRevenue.barChart.roundedArrow).toBeDefined();
      expect(result.netRevenue.barChart.roundedArrow.prefix).toBe("CAGR: ");

      expect(result.brandPower).toBeDefined();
      expect(result.brandPower.barChart).toBeDefined();
      expect(result.brandPower.barChart.roundedArrow).toBeDefined();
      expect(result.brandPower.barChart.roundedArrow.prefix).toBeUndefined();
    });
  });

  describe("empty data", () => {
    it("returns an empty message for each KPI when all datasources are empty", async () => {
      const result = await evaluateExpression(createMockInput({}));

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result).not.toBeNull();

      const kpiKeys = [
        "volume",
        "netRevenue",
        "cores",
        "marketShare",
        "brandPower",
      ];
      expect(Object.keys(result).sort()).toEqual(kpiKeys.sort());

      for (const key of kpiKeys) {
        const block = result[key];
        expect(block).toBeDefined();
        expect(block.chartHeader).toBeDefined();
        expect(block.chartHeader.title).toBeDefined();
        expect(block.bigNumberData).toEqual([]);
        expect(block.noticeMessage).toBe(
          "Data not available for this view. Try adjusting your filters.",
        );
      }
    });

    it("returns empty message for a KPI with no rows while others have data", async () => {
      const volumeRows: GrowthRow[] = [
        {
          kpi_name: "volume",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-06-30T00:00:00.000Z",
          ac: 100,
          ac_vs_ly: 5,
          ac_vs_bu: 2,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "%",
          period: "H1",
        },
      ];

      const result = await evaluateExpression(
        createMockInput({ volume: volumeRows }),
      );

      expect(result.volume.chartHeader.title).toBe("Volume");
      expect(result.volume.barChart).toBeDefined();
      expect(result.volume.noticeMessage).toBeUndefined();

      expect(result.netRevenue.noticeMessage).toBe(
        "Data not available for this view. Try adjusting your filters.",
      );
      expect(result.netRevenue.bigNumberData).toEqual([]);

      expect(result.cores.noticeMessage).toBe(
        "Data not available for this view. Try adjusting your filters.",
      );
      expect(result.marketShare.noticeMessage).toBe(
        "Data not available for this view. Try adjusting your filters.",
      );
      expect(result.brandPower.noticeMessage).toBe(
        "Data not available for this view. Try adjusting your filters.",
      );
    });
  });

  describe("period label (same month / same quarter)", () => {
    it("shows single month in chartHeader.period when dt_ini and dt_end are in the same month", async () => {
      const volumeRows: GrowthRow[] = [
        {
          kpi_name: "volume",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-01-31T00:00:00.000Z",
          ac: 100,
          ac_vs_ly: 5,
          ac_vs_bu: 2,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "%",
          period: "Jan",
        },
      ];

      const result = await evaluateExpression(
        createMockInput({ volume: volumeRows }),
      );

      expect(result.volume.chartHeader.period).toBe("Jan'25");
    });

    it("shows month range in chartHeader.period when dt_ini and dt_end span multiple months", async () => {
      const volumeRows: GrowthRow[] = [
        {
          kpi_name: "volume",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-03-31T00:00:00.000Z",
          ac: 100,
          ac_vs_ly: 5,
          ac_vs_bu: 2,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "%",
          period: "Q1",
        },
      ];

      const result = await evaluateExpression(
        createMockInput({ volume: volumeRows }),
      );

      expect(result.volume.chartHeader.period).toBe("Jan-Mar'25");
    });

    it("shows single quarter in chartHeader.period for brandPower when dt_ini and dt_end are in the same quarter", async () => {
      const brandPowerRows: GrowthRow[] = [
        {
          kpi_name: "power",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-03-31T00:00:00.000Z",
          ac: 75,
          ac_vs_ly: 2,
          ac_vs_bu: 0,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "%",
        },
      ];

      const result = await evaluateExpression(
        createMockInput({ brandPower: brandPowerRows }),
      );

      expect(result.brandPower.chartHeader.period).toBe("Q1'25");
    });

    it("shows quarter range in chartHeader.period for brandPower when dt_ini and dt_end span multiple quarters", async () => {
      const brandPowerRows: GrowthRow[] = [
        {
          kpi_name: "power",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac: 75,
          ac_vs_ly: 2,
          ac_vs_bu: 0,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "%",
        },
      ];

      const result = await evaluateExpression(
        createMockInput({ brandPower: brandPowerRows }),
      );

      expect(result.brandPower.chartHeader.period).toBe("Q1-Q4'25");
    });
  });
});
