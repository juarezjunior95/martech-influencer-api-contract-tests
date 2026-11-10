import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DATASOURCE_NAME = "value-creation_portfolio-performance_pl_deep-dive";

const buildRow = (
  kpiTitle: string,
  overrides: Record<string, unknown> = {},
) => ({
  kpi_title: kpiTitle,
  ac: 10,
  ly: 8,
  bu: 9,
  og_vs_bu: 1,
  og_vs_bu_comp: 2,
  og_vs_bu_comp_direction: "up",
  og_vs_ly: 3,
  og_vs_ly_comp: 4,
  og_vs_ly_comp_direction: "down",
  dt_ini: null,
  dt_end: null,
  ...overrides,
});

describe("plDeepDiveFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/portfolio-performance/pl/plDeepDiveFormatter.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should build the deep dive table from data-service payload", async () => {
    const mockInput = {
      config: {
        currentYear: 2026,
      },
      name: DATASOURCE_NAME,
      data: [
        buildRow("Total Volume", {
          ac: 157656.4,
          ly: 156866.7,
          bu: 156249.1,
          og_vs_bu: 1738.6,
          og_vs_bu_comp: 1.1,
          og_vs_ly: 789.7,
          og_vs_ly_comp: 0.5,
        }),
        buildRow("Gross Turnover"),
        buildRow("Excise duty $ eco taxes"),
        buildRow("Discounts"),
        buildRow("NET REVENUE"),
        buildRow("VIC"),
        buildRow("VLC"),
        buildRow("MACO"),
        buildRow("Marketing Costs"),
        buildRow("Sales Costs"),
        buildRow("CORES"),
        buildRow("S&M"),
        buildRow("VILC"),
        buildRow("NR/hl"),
        buildRow("VIC/hl"),
        buildRow("VLC/hl"),
        buildRow("MACO/hl"),
        buildRow("CORES/hl"),
        buildRow("VILC/hl"),
        buildRow("MACO Margin", {
          ac: 56.6,
          ly: 56.9,
          bu: 56.5,
          og_vs_bu: 58.3,
          og_vs_bu_comp: 0,
          og_vs_bu_comp_direction: "down",
          og_vs_ly: 49.7,
          og_vs_ly_comp: -0.7,
          og_vs_ly_comp_direction: "down",
        }),
      ],
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result).not.toHaveProperty("empty");
    expect(result.header[2].children).toEqual([
      { id: "py_ac", title: "2025 AC YTD" },
      { id: "cy_bu", title: "2026 BU YTD" },
      { id: "cy_ac", title: "2026 AC YTD" },
    ]);

    const firstBlock = result.rows[0];
    expect(firstBlock[0].kpi_mio_khl.value).toBe("Total Volume");
    expect(
      firstBlock.find((row) => row.kpi_mio_khl.value === "NET REVENUE"),
    ).toBeDefined();
    expect(
      firstBlock.find((row) => row.kpi_mio_khl.value === "CORES"),
    ).toBeDefined();

    const otherKpisBlock = result.rows[4];
    expect(otherKpisBlock[0].kpi_mio_khl.value).toBe("Other KPI'S");

    const macoMarginRow = otherKpisBlock.find(
      (row) => row.kpi_mio_khl.value === "MACO Margin",
    );
    expect(macoMarginRow.organic_growth_vs_bu_mio.unitMeasure).toBe("%");
    expect(macoMarginRow.organic_growth_vs_bu.unitMeasure).toBe("pp");
    expect(macoMarginRow.py_ac.unitMeasure).toBe("%");
  });

  it("should keep supporting the legacy datasources object shape", async () => {
    const mockInput = {
      datasources: {
        [DATASOURCE_NAME]: [
          buildRow("S&M", {
            dt_ini: "2024-01-01T00:00:00.000Z",
          }),
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.header[2].children[0].title).toBe("2023 AC YTD");
    expect(result.header[2].children[1].title).toBe("2024 BU YTD");
    expect(result.rows[1][0].kpi_mio_khl.value).toBe("S&M");
  });

  it("should return empty state when datasource has no rows", async () => {
    const result = await compiledExpression.evaluate({
      datasources: {
        [DATASOURCE_NAME]: [],
      },
    });

    expect(result).toEqual({ empty: true });
  });
});
