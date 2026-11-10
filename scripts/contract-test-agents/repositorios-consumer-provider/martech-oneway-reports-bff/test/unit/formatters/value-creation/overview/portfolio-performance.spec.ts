import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("portfolio-performance formatter (value-creation overview)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/overview/portfolio-performance.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  const minimalVolume = (segment: string, monthRefresh: string) => [
    {
      segment,
      kpi_name: "volume_growth_contr",
      ac: 50,
      month_refresh: monthRefresh,
    },
    { segment, kpi_name: "volume_weight", ac: 50, month_refresh: monthRefresh },
    {
      segment,
      kpi_name: "volume",
      ac: 1000,
      ac_vs_ly: -1.5,
      month_refresh: monthRefresh,
    },
  ];

  const minimalVsLy = (
    segment: string,
    monthRefresh: string,
    periodRefresh: string,
  ) => [
    {
      segment,
      kpi_name: "nr",
      ac: 5000,
      ac_vs_ly: 2.1,
      comp_ac_ly_direction: "up",
      month_refresh: monthRefresh,
    },
    {
      segment,
      kpi_name: "cores",
      ac: 4500,
      ac_vs_ly: 1.8,
      comp_ac_ly_direction: "up",
      month_refresh: monthRefresh,
    },
    {
      segment,
      kpi_name: "power",
      ac: 72,
      ac_vs_ly: 0.5,
      comp_ac_ly_direction: "up",
      period_refresh: periodRefresh,
    },
    { segment, kpi_name: "sm_of_maco", ac: 14.2, month_refresh: monthRefresh },
    { segment, kpi_name: "sm_weight", ac: 65, month_refresh: monthRefresh },
  ];

  it("should return columnDefs, rowData and splits", async () => {
    const volume = [
      ...minimalVolume("Megabrands", "Oct'25"),
      ...minimalVolume("Expansion", "Oct'25"),
      ...minimalVolume("Sustain", "Oct'25"),
      ...minimalVolume("Tail", "Oct'25"),
      ...minimalVolume("TOTAL", "Oct'25"),
    ];
    const vsLy = [
      ...minimalVsLy("Megabrands", "Sep'25", "Q3'25"),
      ...minimalVsLy("Expansion", "Sep'25", "Q3'25"),
      ...minimalVsLy("Sustain", "Sep'25", "Q3'25"),
      ...minimalVsLy("Tail", "Sep'25", "Q3'25"),
      ...minimalVsLy("TOTAL", "Sep'25", "Q3'25"),
    ];

    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_overview_portfolio-performance_volume":
          volume,
        "value-creation_portfolio-performance_overview_portfolio-performance_vs-ly":
          vsLy,
        "value-creation_portfolio-performance_overview_portfolio-performance_brands":
          [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("columnDefs");
    expect(result).toHaveProperty("rowData");
    expect(result).toHaveProperty("splits");

    expect(Array.isArray(result.columnDefs)).toBe(true);
    expect(Array.isArray(result.rowData)).toBe(true);
    expect(result.rowData).toHaveLength(7);

    expect(Array.isArray(result.splits)).toBe(true);
    expect(result.splits).toContainEqual(["Portfolio"]);
    expect(result.splits).toContainEqual(["Volume"]);
    expect(result.splits).toContainEqual(["Brands"]);
  });

  it("should set header subtitles from volume and vs-ly refresh", async () => {
    const volume = [
      ...minimalVolume("Megabrands", "Nov'25"),
      ...minimalVolume("Expansion", "Nov'25"),
      ...minimalVolume("Sustain", "Nov'25"),
      ...minimalVolume("Tail", "Nov'25"),
      ...minimalVolume("TOTAL", "Nov'25"),
    ];
    const vsLy = [
      ...minimalVsLy("Megabrands", "Oct'25", "Q3'25"),
      ...minimalVsLy("Expansion", "Oct'25", "Q3'25"),
      ...minimalVsLy("Sustain", "Oct'25", "Q3'25"),
      ...minimalVsLy("Tail", "Oct'25", "Q3'25"),
      ...minimalVsLy("TOTAL", "Oct'25", "Q3'25"),
    ];

    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_overview_portfolio-performance_volume":
          volume,
        "value-creation_portfolio-performance_overview_portfolio-performance_vs-ly":
          vsLy,
        "value-creation_portfolio-performance_overview_portfolio-performance_brands":
          [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const volumeCol = result.columnDefs.find(
      (c: any) => c.headerName === "Volume",
    );
    expect(volumeCol?.headerGroupComponentParams?.subtitle).toBe("Nov'25");

    const nrCol = result.columnDefs.find(
      (c: any) => c.headerName === "Net Revenue",
    );
    expect(nrCol?.headerGroupComponentParams?.subtitle).toBe("Oct'25");

    const powerCol = result.columnDefs.find(
      (c: any) => c.headerName === "Brand Power",
    );
    expect(powerCol?.headerGroupComponentParams?.subtitle).toBe("Q3'25");
  });

  it("should build row data with portfolio label Total for TOTAL segment", async () => {
    const volume = [
      ...minimalVolume("Megabrands", "Oct'25"),
      ...minimalVolume("Expansion", "Oct'25"),
      ...minimalVolume("Sustain", "Oct'25"),
      ...minimalVolume("Tail", "Oct'25"),
      ...minimalVolume("TOTAL", "Oct'25"),
    ];
    const vsLy = [
      ...minimalVsLy("Megabrands", "Sep'25", "Q3'25"),
      ...minimalVsLy("Expansion", "Sep'25", "Q3'25"),
      ...minimalVsLy("Sustain", "Sep'25", "Q3'25"),
      ...minimalVsLy("Tail", "Sep'25", "Q3'25"),
      ...minimalVsLy("TOTAL", "Sep'25", "Q3'25"),
    ];

    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_overview_portfolio-performance_volume":
          volume,
        "value-creation_portfolio-performance_overview_portfolio-performance_vs-ly":
          vsLy,
        "value-creation_portfolio-performance_overview_portfolio-performance_brands":
          [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const totalRow = result.rowData[6];
    expect(totalRow.portfolio).toBe("Total");
    expect(totalRow.portfolio_config?.radiusRight).toBe(true);
    expect(totalRow.portfolio_config?.radiusTop).toBe(true);

    const firstDataRow = result.rowData[1];
    expect(firstDataRow.portfolio).toBe("Megabrands");
    expect(firstDataRow.volume_growth_contr).toBe(50);
    expect(firstDataRow.volume_weight).toBe(50);
    expect(firstDataRow.volume_vs_ly).toBe(-1.5);
    expect(firstDataRow.net_revenue_vs_ly).toBe(2.1);
    expect(firstDataRow.volume_vs_ly_config?.unitMeasure).toBe("%");
    expect(firstDataRow.brand_power_vs_ly_config?.unitMeasure ?? "pp").toBe(
      "pp",
    );
  });

  it("should include brands for segment when brands datasource is provided", async () => {
    const volume = [
      ...minimalVolume("Megabrands", "Oct'25"),
      ...minimalVolume("Expansion", "Oct'25"),
      ...minimalVolume("Sustain", "Oct'25"),
      ...minimalVolume("Tail", "Oct'25"),
      ...minimalVolume("TOTAL", "Oct'25"),
    ];
    const vsLy = [
      ...minimalVsLy("Megabrands", "Sep'25", "Q3'25"),
      ...minimalVsLy("Expansion", "Sep'25", "Q3'25"),
      ...minimalVsLy("Sustain", "Sep'25", "Q3'25"),
      ...minimalVsLy("Tail", "Sep'25", "Q3'25"),
      ...minimalVsLy("TOTAL", "Sep'25", "Q3'25"),
    ];
    const brandsInput = [
      {
        segment: "Megabrands",
        brand: "Stella",
        brand_image: "url",
        ac_vs_ly: 3.5,
        comp_ac_ly_direction: "up",
        country: "ABI",
      },
    ];

    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_overview_portfolio-performance_volume":
          volume,
        "value-creation_portfolio-performance_overview_portfolio-performance_vs-ly":
          vsLy,
        "value-creation_portfolio-performance_overview_portfolio-performance_brands":
          brandsInput,
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    const firstDataRow = result.rowData[1];
    const brandsFromResult = firstDataRow.brands_vol_og_vs_ly_config?.brands;
    expect(Array.isArray(brandsFromResult)).toBe(true);
    expect(brandsFromResult).toHaveLength(1);
    expect((brandsFromResult[0] as any).name).toBe("Stella");
    expect((brandsFromResult[0] as any).variation).toBe(3.5);
    expect((brandsFromResult[0] as any).variationDirection).toBe("up");
  });
});
