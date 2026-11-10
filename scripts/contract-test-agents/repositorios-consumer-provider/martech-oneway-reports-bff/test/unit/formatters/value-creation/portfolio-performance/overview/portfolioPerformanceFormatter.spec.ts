import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const PERFORMANCE_DATASOURCE =
  "value-creation_portfolio-performance_overview_portfolio-performance_portfolio-performance";
const BRANDS_DATASOURCE =
  "value-creation_portfolio-performance_overview_portfolio-performance_brands";

const buildInput = (
  portfolioPerformance: Record<string, unknown>[] = [],
  brands: Record<string, unknown>[] = [],
) => ({
  datasources: {
    [PERFORMANCE_DATASOURCE]: portfolioPerformance,
    [BRANDS_DATASOURCE]: brands,
  },
});

const buildPerformanceRow = (
  overrides: Record<string, unknown> = {},
): Record<string, unknown> => ({
  segment: "Megabrands",
  volume_period_refresh: "Q1'26",
  volume_month_refresh: "Apr'26",
  others_period_refresh: "Q1'26",
  others_month_refresh: "Apr'26",
  volume_growth_contr: 57.8,
  comp_volume_growth_contr_direction: "up",
  volume_weight: 59.5,
  comp_volume_weight_direction: "up",
  volume_ac_vs_ly: -0.6,
  comp_volume_ac_vs_ly_direction: "down",
  nr_ac_vs_ly: 4.5,
  comp_nr_ac_vs_ly_direction: "up",
  cores_ac_vs_ly: 5.3,
  comp_cores_ac_vs_ly_direction: "up",
  brand_power_pp: 0.6,
  comp_brand_power_pp_direction: "up",
  sm_of_maco_ac: 14.2,
  comp_sm_of_maco_ac_direction: "up",
  sm_weight: 65.2,
  comp_sm_weight_direction: "up",
  ...overrides,
});

describe("portfolioPerformanceFormatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/portfolio-performance/overview/portfolioPerformanceFormatter.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return portfolio performance table with all data", async () => {
    const mockInput = buildInput(
      [
        buildPerformanceRow(),
        buildPerformanceRow({
          segment: "Expansion",
          volume_growth_contr: 24.6,
          volume_weight: 5,
          volume_ac_vs_ly: 32.7,
          comp_volume_ac_vs_ly_direction: "up",
          nr_ac_vs_ly: 37.6,
          cores_ac_vs_ly: 41,
          brand_power_pp: 0.4,
          sm_of_maco_ac: 21.5,
          sm_weight: 9.7,
        }),
        buildPerformanceRow({
          segment: "TOTAL",
          volume_growth_contr: 100,
          volume_weight: 100,
          volume_ac_vs_ly: 0.5,
          comp_volume_ac_vs_ly_direction: "up",
          nr_ac_vs_ly: 5.4,
          cores_ac_vs_ly: 4.1,
          brand_power_pp: 0.1,
          sm_of_maco_ac: 14.1,
          sm_weight: 100,
        }),
      ],
      [
        {
          segment: "Megabrands",
          brand: "Michelob ultra",
          brand_image: "https://example.com/michelob.png",
          ac_vs_ly: 4.8,
          comp_ac_ly_direction: "up",
          country: "ABI",
        },
        {
          segment: "Megabrands",
          brand: "Budweiser",
          brand_image: "https://example.com/budweiser.png",
          ac_vs_ly: -6.2,
          comp_ac_ly_direction: "down",
          country: "ABI",
        },
      ],
    );

    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
    expect(result).toHaveProperty("splits");

    expect(Array.isArray(result.header)).toBe(true);
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBe(2);
    expect(result.rows[0].length).toBe(2);
    expect(result.rows[1].length).toBe(1);
    expect(Array.isArray(result.splits)).toBe(true);
    expect(result.splits.length).toBe(5);
  });

  it("should create correct header configuration", async () => {
    const mockInput = buildInput([
      buildPerformanceRow({
        volume_month_refresh: "Oct'25",
        others_month_refresh: "Sep'25",
        others_period_refresh: "Q3'25",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);
    const headers = result.header;

    expect(headers[0].title).toBe("Portfolio");
    expect(headers[0].id).toBe("portfolio");

    expect(headers[1].title).toBe("Volume");
    expect(headers[1].subtitle).toBe("Oct'25");
    expect(headers[1].children.length).toBe(3);
    expect(headers[1].children[0].id).toBe("volume_growth_contr");
    expect(headers[1].children[1].id).toBe("volume_weight");
    expect(headers[1].children[2].id).toBe("volume_vs_ly");

    expect(headers[2].title).toBe("Net Revenue");
    expect(headers[2].subtitle).toBe("Sep'25");

    expect(headers[3].title).toBe("CORES");
    expect(headers[3].subtitle).toBe("Sep'25");

    expect(headers[4].title).toBe("Brand Power");
    expect(headers[4].subtitle).toBe("Q3'25");

    expect(headers[5].title).toBe("S&M");
    expect(headers[5].subtitle).toBe("Sep'25");

    expect(headers[6].title).toBe("Brands");
  });

  it("should build rows with correct structure for segments", async () => {
    const mockInput = buildInput([buildPerformanceRow()]);

    const result = await compiledExpression.evaluate(mockInput);
    const firstRow = result.rows[0][0];

    expect(firstRow.portfolio.value).toBe("Megabrands");
    expect(firstRow.portfolio.marginBottom).toBe(true);

    expect(firstRow.volume_growth_contr.value).toBe(57.8);
    expect(firstRow.volume_growth_contr.unitMeasure).toBe("%");

    expect(firstRow.volume_weight.value).toBe(59.5);
    expect(firstRow.volume_weight.unitMeasure).toBe("%");

    expect(firstRow.volume_vs_ly.value).toBe(-0.6);
    expect(firstRow.volume_vs_ly.unitMeasure).toBe("%");
    expect(firstRow.volume_vs_ly.variationDirection).toBe("down");

    expect(firstRow.net_revenue_vs_ly.value).toBe(4.5);
    expect(firstRow.net_revenue_vs_ly.unitMeasure).toBe("%");
    expect(firstRow.net_revenue_vs_ly.variationDirection).toBe("up");

    expect(firstRow.cores_vs_ly.value).toBe(5.3);
    expect(firstRow.cores_vs_ly.variationDirection).toBe("up");

    expect(firstRow.brand_power_vs_ly.value).toBe(0.6);
    expect(firstRow.brand_power_vs_ly.unitMeasure).toBe("pp");
    expect(firstRow.brand_power_vs_ly.variationDirection).toBe("up");

    expect(firstRow.sm_of_maco.value).toBe(14.2);
    expect(firstRow.sm_weight.value).toBe(65.2);

    expect(firstRow.brands_vol_og_vs_ly.value).toBe("_brands");
  });

  it("should round numeric cells and brand variations to one decimal", async () => {
    const mockInput = buildInput(
      [
        buildPerformanceRow({
          volume_growth_contr: 53.54,
          volume_weight: "61.24",
          volume_ac_vs_ly: 1.06,
          comp_volume_ac_vs_ly_direction: "up",
          nr_ac_vs_ly: 7.54,
          cores_ac_vs_ly: 8.04,
          brand_power_pp: 0.26,
          sm_of_maco_ac: 13.04,
          sm_weight: 60.76,
        }),
      ],
      [
        {
          segment: "Megabrands",
          brand: "Michelob ultra",
          brand_image: "https://example.com/michelob.png",
          ac_vs_ly: 28.96,
          comp_ac_ly_direction: "up",
          country: "ABI",
        },
      ],
    );

    const result = await compiledExpression.evaluate(mockInput);
    const firstRow = result.rows[0][0];

    expect(firstRow.volume_growth_contr.value).toBe(53.5);
    expect(firstRow.volume_weight.value).toBe(61.2);
    expect(firstRow.volume_vs_ly.value).toBe(1.1);
    expect(firstRow.net_revenue_vs_ly.value).toBe(7.5);
    expect(firstRow.cores_vs_ly.value).toBe(8);
    expect(firstRow.brand_power_vs_ly.value).toBe(0.3);
    expect(firstRow.sm_of_maco.value).toBe(13);
    expect(firstRow.sm_weight.value).toBe(60.8);
    expect(firstRow.brands_vol_og_vs_ly.brands[0].variation).toBe(29);
  });

  it("should add radius properties to Total row", async () => {
    const mockInput = buildInput([
      buildPerformanceRow({
        segment: "TOTAL",
        volume_growth_contr: 100,
        volume_weight: 100,
        volume_ac_vs_ly: -2.9,
        nr_ac_vs_ly: 1.5,
        cores_ac_vs_ly: 2.9,
        brand_power_pp: 0.1,
        sm_of_maco_ac: 14.1,
        sm_weight: 100,
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);
    const totalRow = result.rows[1][0];

    expect(totalRow.portfolio.value).toBe("Total");
    expect(totalRow.portfolio.radiusRight).toBe(true);
    expect(totalRow.portfolio.radiusTop).toBe(true);

    expect(totalRow.volume_growth_contr.radiusRight).toBe(true);
    expect(totalRow.volume_growth_contr.radiusTop).toBe(true);

    expect(totalRow.volume_vs_ly.radiusRight).toBe(true);
    expect(totalRow.volume_vs_ly.radiusTop).toBe(true);

    expect(totalRow.net_revenue_vs_ly.radiusRight).toBe(true);
    expect(totalRow.net_revenue_vs_ly.radiusTop).toBe(true);

    expect(totalRow.sm_weight.radiusRight).toBe(true);
    expect(totalRow.sm_weight.radiusTop).toBe(true);

    expect(totalRow.portfolio.marginBottom).toBe(false);
  });

  it("should include brands data in segment rows", async () => {
    const mockInput = buildInput(
      [buildPerformanceRow()],
      [
        {
          segment: "Megabrands",
          brand: "Michelob ultra",
          brand_image: "https://example.com/michelob.png",
          ac_vs_ly: 4.8,
          comp_ac_ly_direction: "up",
          country: "ABI",
        },
        {
          segment: "Megabrands",
          brand: "Corona",
          brand_image: "https://example.com/corona.png",
          ac_vs_ly: 4.7,
          comp_ac_ly_direction: "up",
          country: "ABI",
        },
      ],
    );

    const result = await compiledExpression.evaluate(mockInput);
    const firstRow = result.rows[0][0];
    const brands = firstRow.brands_vol_og_vs_ly.brands;

    expect(brands.length).toBe(2);

    expect(brands[0].name).toBe("Michelob ultra");
    expect(brands[0].src).toBe("https://example.com/michelob.png");
    expect(brands[0].variation).toBe(4.8);
    expect(brands[0].variationMeasure).toBe("%");
    expect(brands[0].variationDirection).toBe("up");
    expect(brands[0].country).toBe("ABI");

    expect(brands[1].name).toBe("Corona");
    expect(brands[1].variation).toBe(4.7);
  });

  it("should handle missing data gracefully with safeNumber", async () => {
    const result = await compiledExpression.evaluate(buildInput());
    expect(result.rows.length).toBe(2);
    expect(result.rows[0].length).toBe(0);
    expect(result.rows[1].length).toBe(1);

    const totalRow = result.rows[1][0];

    expect(totalRow.volume_growth_contr.value).toBe("-");
    expect(totalRow.volume_weight.value).toBe("-");
    expect(totalRow.volume_vs_ly.value).toBe("-");
    expect(totalRow.net_revenue_vs_ly.value).toBe("-");
    expect(totalRow.cores_vs_ly.value).toBe("-");
    expect(totalRow.brand_power_vs_ly.value).toBe("-");
    expect(totalRow.sm_of_maco.value).toBe("-");
    expect(totalRow.sm_weight.value).toBe("-");
  });

  it("should render safeNumber dashes for a segment with partial KPI data", async () => {
    const mockInput = buildInput([
      {
        segment: "Megabrands",
        volume_ac_vs_ly: 1,
      },
    ]);

    const result = await compiledExpression.evaluate(mockInput);
    expect(result.rows[0].length).toBe(1);

    const firstRow = result.rows[0][0];

    expect(firstRow.volume_growth_contr.value).toBe("-");
    expect(firstRow.volume_weight.value).toBe("-");
    expect(firstRow.volume_vs_ly.value).toBe(1);
    expect(firstRow.net_revenue_vs_ly.value).toBe("-");
    expect(firstRow.cores_vs_ly.value).toBe("-");
    expect(firstRow.brand_power_vs_ly.value).toBe("-");
    expect(firstRow.sm_of_maco.value).toBe("-");
    expect(firstRow.sm_weight.value).toBe("-");

    expect(firstRow.brands_vol_og_vs_ly.value).toBe("_brands");
  });

  it("should have correct splits configuration", async () => {
    const result = await compiledExpression.evaluate(buildInput());

    expect(result.splits).toEqual([
      ["Portfolio"],
      ["Volume"],
      ["Net Revenue", "CORES", "Market Share", "Brand Power"],
      ["S&M"],
      ["Brands"],
    ]);
  });

  it("should determine variation direction correctly", async () => {
    const mockInput = buildInput([
      {
        segment: "Megabrands",
        volume_ac_vs_ly: 5.5,
      },
      {
        segment: "Expansion",
        volume_ac_vs_ly: -3.2,
      },
      {
        segment: "Sustain",
        volume_ac_vs_ly: 0,
      },
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.rows[0][0].volume_vs_ly.value).toBe(5.5);
    expect(result.rows[0][0].volume_vs_ly.variationDirection).toBe("up");

    expect(result.rows[0][1].volume_vs_ly.value).toBe(-3.2);
    expect(result.rows[0][1].volume_vs_ly.variationDirection).toBe("down");

    expect(result.rows[0][2].volume_vs_ly.value).toBe(0);
    expect(result.rows[0][2].volume_vs_ly.variationDirection).toBeNull();
  });

  it("should render dash when brand power arrives null", async () => {
    const mockInput = buildInput([
      buildPerformanceRow({
        brand_power_pp: null,
        comp_brand_power_pp_direction: "",
      }),
    ]);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.rows[0][0].brand_power_vs_ly.value).toBe("-");
    expect(result.rows[0][0].brand_power_vs_ly.unitMeasure).toBeUndefined();
    expect(
      result.rows[0][0].brand_power_vs_ly.variationDirection,
    ).toBeUndefined();
  });
});
