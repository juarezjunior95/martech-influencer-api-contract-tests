import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("plFormatter (P&L brand table)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/portfolio-performance/pl/plFormatter.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return table.empty when volume datasource is empty", async () => {
    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_pl_brand_volume": [],
        "value-creation_portfolio-performance_pl_brand_growth-contribution": [],
        "value-creation_portfolio-performance_pl_brand_output": [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.table).toEqual({ empty: true });
  });

  it("should build table with header, filtersOptions and rows from datasources", async () => {
    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_pl_brand_volume": [
          {
            kpi_name: "volume",
            segment: "Megabrands",
            raw_brand: "Brahma",
            ac: 100,
            ac_vs_ly: -2,
            dt_ini: "2026-01-01T00:00:00.000Z",
            variationDirectionAc: "up",
            variationDirectionVsLy: "down",
          },
          {
            kpi_name: "volume",
            segment: "TT",
            raw_brand: "N/A",
            ac: 1.2,
            ac_vs_ly: 0.7,
            dt_ini: "2026-01-01T00:00:00.000Z",
            variationDirectionAc: "up",
            variationDirectionVsLy: "up",
          },
        ],
        "value-creation_portfolio-performance_pl_brand_growth-contribution": [
          {
            kpi_name: "volume_growth_contr",
            segment: "N/A",
            raw_brand: "N/A",
            ac: 100,
            refreshMonthLabel: "Jan'26",
          },
          {
            kpi_name: "volume_growth_contr",
            segment: "Megabrands",
            raw_brand: "Brahma",
            ac: 0.6,
            refreshMonthLabel: "Jan'26",
          },
        ],
        "value-creation_portfolio-performance_pl_brand_output": [
          {
            kpi_name: "market_share",
            segment: "Megabrands",
            raw_brand: "Brahma",
            ac: 18.6,
            ac_vs_ly: -0.6,
            refreshMonthLabel: "Jan'26",
            variationDirectionVsLy: "down",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("table");
    expect(result.table).not.toHaveProperty("empty");
    expect(Array.isArray(result.table.header)).toBe(true);
    expect(
      result.table.header.some((h: { id?: string }) => h.id === "kpi"),
    ).toBe(true);
    expect(Array.isArray(result.table.filtersOptions)).toBe(true);
    expect(Array.isArray(result.table.rows)).toBe(true);
    expect(result.table.rows).toHaveLength(2);

    const kpiCol = result.table.header.find(
      (h: { id?: string }) => h.id === "kpi",
    );
    expect(kpiCol?.children?.[0]?.subtitle).toBe("Jan'26");

    const megabrandsCol = result.table.header.find(
      (h: { title?: string }) => h.title === "Megabrands",
    );
    expect(megabrandsCol?.children?.[0]?.id).toBe("megabrands_brahma");

    const firstBlock = result.table.rows[0];
    expect(Array.isArray(firstBlock)).toBe(true);
    expect(firstBlock[0].profit_loss.chartLegend.title).toBe("Volume Growth");
    expect(firstBlock[0].megabrands_brahma.chartData.variationMeasure).toBe(
      "%",
    );
    /* 1ª barra = AC (2026), 2ª = vs LY (2025): Ac up → verde, VsLy down → vermelho */
    expect(firstBlock[0].megabrands_brahma.chartData.variationColor[0]).toBe(
      "#49764B",
    );
    expect(firstBlock[0].megabrands_brahma.chartData.variationColor[1]).toBe(
      "#A20A0A",
    );

    const growthContribRow = firstBlock.find(
      (r: { profit_loss?: { value?: string } }) =>
        r.profit_loss?.value === "Growth Contribution",
    );
    expect(growthContribRow?.megabrands_brahma.value).toBe(0.6);
    expect(growthContribRow?.megabrands_brahma.unitMeasure).toBe("%");

    const outputBlock = result.table.rows[1];
    const msRow = outputBlock.find(
      (r: { profit_loss?: { value?: string } }) =>
        r.profit_loss?.value === "Market Share",
    );
    expect(msRow?.profit_loss?.subtitle).toBe("Jan'26");
    expect(msRow?.megabrands_brahma?.unitMeasure).toBe("%");
  });

  it("should omit profit_loss.subtitle on Growth Contribution row and use pp on S&M vs LY", async () => {
    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_pl_brand_volume": [
          {
            kpi_name: "volume",
            segment: "Megabrands",
            raw_brand: "Brahma",
            ac: 1,
            ac_vs_ly: 0,
            dt_ini: "2026-01-01T00:00:00.000Z",
            variationDirectionAc: "up",
            variationDirectionVsLy: "up",
          },
        ],
        "value-creation_portfolio-performance_pl_brand_growth-contribution": [
          {
            kpi_name: "volume_growth_contr",
            segment: "N/A",
            raw_brand: "N/A",
            ac: 100,
            refreshMonthLabel: "Jan'26",
          },
          {
            kpi_name: "sm",
            segment: "Megabrands",
            raw_brand: "Brahma",
            ac: -5,
            ac_vs_ly: 2,
            refreshMonthLabel: "Jan'26",
            variationDirectionVsLy: "up",
          },
        ],
        "value-creation_portfolio-performance_pl_brand_output": [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);
    const firstBlock = result.table.rows[0] as Record<string, unknown>[];

    const gcRow = firstBlock.find(
      (r) =>
        (r.profit_loss as { value?: string })?.value === "Growth Contribution",
    );
    expect(
      Object.prototype.hasOwnProperty.call(
        gcRow?.profit_loss ?? {},
        "subtitle",
      ),
    ).toBe(false);

    const smVsLy = firstBlock.find(
      (r) =>
        (r.profit_loss as { value?: string })?.value === "vs LY" &&
        (r.tt_market_beer_adj as { unitMeasure?: string } | undefined) ===
          undefined &&
        (r.megabrands_brahma as { unitMeasure?: string } | undefined)
          ?.unitMeasure === "pp",
    );
    expect(smVsLy).toBeDefined();
    expect((smVsLy?.megabrands_brahma as { value?: number })?.value).toBe(2);
    /* S&M: aumento vs LY (up) = mau → vermelho */
    expect(
      (smVsLy?.megabrands_brahma as { variationDirection?: string })
        ?.variationDirection,
    ).toBe("#A20A0A");
  });

  it("should read datasources from components[0].data.datasources", async () => {
    const mockInput = {
      components: [
        {
          data: {
            datasources: {
              "value-creation_portfolio-performance_pl_brand_volume": [
                {
                  kpi_name: "volume",
                  segment: "Tail",
                  raw_brand: "TAIL",
                  ac: 1,
                  ac_vs_ly: -1,
                  dt_ini: "2026-01-01T00:00:00.000Z",
                  variationDirectionAc: "down",
                  variationDirectionVsLy: "down",
                },
              ],
              "value-creation_portfolio-performance_pl_brand_growth-contribution":
                [
                  {
                    kpi_name: "volume_growth_contr",
                    segment: "N/A",
                    raw_brand: "N/A",
                    ac: 1,
                    refreshMonthLabel: "Feb'26",
                  },
                ],
              "value-creation_portfolio-performance_pl_brand_output": [],
            },
          },
        },
      ],
    };

    const result = await compiledExpression.evaluate(mockInput);

    const tailCol = result.table.header.find(
      (h: { title?: string }) => h.title === "Tail",
    );
    expect(tailCol?.children?.[0]?.id).toBe("tail_tail");
    const kpiCol = result.table.header.find(
      (h: { id?: string }) => h.id === "kpi",
    );
    expect(kpiCol?.children?.[0]?.subtitle).toBe("Feb'26");
  });
});
