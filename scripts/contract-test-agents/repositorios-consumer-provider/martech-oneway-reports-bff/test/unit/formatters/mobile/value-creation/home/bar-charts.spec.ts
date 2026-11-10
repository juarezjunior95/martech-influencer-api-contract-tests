import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

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
  period_type?: string;
};

describe("mobile bar-charts formatter (value-creation home)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/mobile/value-creation/home/bar-charts.jsonata",
  );

  const createMockInput = (opts: {
    volume?: GrowthRow[];
    finance?: GrowthRow[];
    marketShare?: GrowthRow[];
    brandPower?: GrowthRow[];
  }) => ({
    datasources: {
      volume: opts.volume ?? [],
      finance: opts.finance ?? [],
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
    registerHelpers(compiledExpression);
  });

  describe("financial KPI behavior", () => {
    it("keeps only previous YTD, current BU and current YTD in mobile bars", async () => {
      const volumeRows: GrowthRow[] = [
        {
          kpi_name: "volume",
          dt_ini: "2023-01-01T00:00:00.000Z",
          dt_end: "2023-12-31T00:00:00.000Z",
          ac: 70,
          ac_vs_ly: 1.2,
          ac_vs_bu: 0.7,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "up",
          comp_unit_of_measure: "%",
          unit_of_measure: "k hl",
          period: "YTD",
          period_type: "YTD",
        },
        {
          kpi_name: "volume",
          dt_ini: "2024-01-01T00:00:00.000Z",
          dt_end: "2024-12-31T00:00:00.000Z",
          ac: 90,
          ac_vs_ly: 2.1,
          ac_vs_bu: 1.4,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "up",
          comp_unit_of_measure: "%",
          unit_of_measure: "k hl",
          period: "YTD",
          period_type: "YTD",
        },
        {
          kpi_name: "volume",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac: 120,
          ac_vs_ly: 3.5,
          ac_vs_bu: -0.5,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "down",
          comp_unit_of_measure: "%",
          unit_of_measure: "k hl",
          period: "BU",
          period_type: "",
        },
        {
          kpi_name: "volume",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac: 130,
          ac_vs_ly: 4.3,
          ac_vs_bu: 0.8,
          variationDirectionVsLy: "up",
          variationDirectionVsBu: "up",
          comp_unit_of_measure: "%",
          unit_of_measure: "k hl",
          period: "YTD",
          period_type: "YTD",
        },
      ];

      const result: any = await evaluateExpression(
        createMockInput({ volume: volumeRows }),
      );

      expect(result.volume).toBeDefined();
      expect(result.volume.chartHeader.title).toBe("Volume");
      expect(result.volume.chartHeader.measure).toBe("[ k hl ]");
      expect(result.volume.chartHeader.period).toBe("Jan-Dec'25 YTD");

      const labels = JSON.parse(JSON.stringify(result.volume.barChart.labels));
      const dataset = JSON.parse(
        JSON.stringify(result.volume.barChart.datasets[0].data),
      );
      const highlightLabels = JSON.parse(
        JSON.stringify(result.volume.barChart.highlightLabels),
      );
      const stripedIndexes = JSON.parse(
        JSON.stringify(result.volume.barChart.stripedIndexes),
      );
      const normalizedStripedIndexes = Array.isArray(stripedIndexes)
        ? stripedIndexes
        : [stripedIndexes];

      expect(labels).toEqual(["YTD'24", "BU'25", "YTD'25"]);
      expect(dataset).toEqual([90, 120, 130]);
      expect(highlightLabels).toEqual(["YTD'25"]);
      expect(normalizedStripedIndexes).toEqual([1]);

      expect(result.volume.bigNumberData).toHaveLength(2);
      expect(result.volume.bigNumberData[0].comparison).toEqual({
        label: "vs",
        value: "LY",
      });
      expect(result.volume.bigNumberData[1].comparison).toEqual({
        label: "vs",
        value: "BU",
      });
    });
  });

  describe("non-financial KPI behavior", () => {
    it("returns only LY big number and no striped bars for marketShare", async () => {
      const marketShareRows: GrowthRow[] = [
        {
          kpi_name: "market_share",
          dt_ini: "2024-01-01T00:00:00.000Z",
          dt_end: "2024-12-31T00:00:00.000Z",
          ac: 22.1,
          ac_vs_ly: 0.9,
          ac_vs_bu: 0,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
          period: "YTD",
        },
        {
          kpi_name: "market_share",
          dt_ini: "2025-01-01T00:00:00.000Z",
          dt_end: "2025-12-31T00:00:00.000Z",
          ac: 22.8,
          ac_vs_ly: 0.7,
          ac_vs_bu: 0,
          variationDirectionVsLy: "up",
          comp_unit_of_measure: "pp",
          period: "YTD",
        },
      ];

      const result: any = await evaluateExpression(
        createMockInput({ marketShare: marketShareRows }),
      );

      expect(result.marketShare).toBeDefined();
      expect(result.marketShare.chartHeader.title).toBe("Market Share");
      expect(result.marketShare.chartHeader.measure).toBe("[ % ]");
      expect(result.marketShare.bigNumberData).toHaveLength(1);
      expect(result.marketShare.bigNumberData[0].comparison).toEqual({
        label: "vs",
        value: "LY",
      });
      expect(result.marketShare.barChart.stripedIndexes).toBeUndefined();
    });
  });

  describe("empty data", () => {
    it("returns notice message for every KPI block when all datasources are empty", async () => {
      const result: any = await evaluateExpression(createMockInput({}));

      const kpiKeys = [
        "volume",
        "netRevenue",
        "cores",
        "marketShare",
        "brandPower",
      ];

      expect(Object.keys(result).sort()).toEqual(kpiKeys.sort());

      for (const key of kpiKeys) {
        expect(result[key].chartHeader).toBeDefined();
        expect(result[key].bigNumberData).toEqual([]);
        expect(result[key].noticeMessage).toBe(
          "Data not available for this view. Try adjusting your filters.",
        );
      }
    });
  });
});
