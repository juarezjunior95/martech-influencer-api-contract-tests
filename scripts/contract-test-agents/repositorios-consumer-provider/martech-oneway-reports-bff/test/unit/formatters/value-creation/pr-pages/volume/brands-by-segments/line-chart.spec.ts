import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("brands-by-segments line-chart formatter", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/brands-by-segments/line-chart.jsonata",
  );

  type DatasourceEntry = {
    dt_ini: string;
    dt_end: string;
    ac: number;
    ac_vs_ly: number | null;
    bu?: number | null;
    ac_vs_bu?: number | null | string;
    variationDirectionVsLy?: "up" | "down";
    variationDirectionVsBu?: "up" | "down";
    per_hl_vs_ly?: number | null;
    variationDirectionPerHlVsLy?: "up" | "down";
    /** Presente nas linhas NR quando o datasource sinaliza a vista (formatter: $rawData[nr = "nr"]) */
    nr?: string;
    kpi_name?: string;
    vol_ac_vs_ly?: number | null;
    variationDirectionVolVsLy?: "up" | "down";
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    dt_ini: "2026-01-01",
    dt_end: "2026-01-31",
    ac: 50,
    ac_vs_ly: 0.5,
    bu: null,
    ac_vs_bu: null,
    variationDirectionVsLy: "up",
    variationDirectionVsBu: "up",
    ...overrides,
  });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      "line-chart": entries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => {
    return await compiledExpression.evaluate(input);
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return empty object when datasource is empty", async () => {
    const result = await evaluateExpression(createMockInput([]));

    expect(result).toEqual({ empty: true });
  });

  it("should resolve datasources under data.datasources (API/component envelope)", async () => {
    const entries: DatasourceEntry[] = [
      createEntry({
        dt_ini: "2025-01-01",
        dt_end: "2025-01-31",
        ac: 40,
        ac_vs_ly: null,
        bu: null,
        ac_vs_bu: null,
      }),
      createEntry({
        dt_ini: "2026-01-01",
        dt_end: "2026-01-31",
        ac: 50,
        ac_vs_ly: 25,
        bu: null,
        ac_vs_bu: null,
        variationDirectionVsLy: "up",
      }),
    ];

    const envelope = {
      id: "line-chart",
      data: {
        datasources: {
          "line-chart": entries,
        },
      },
    };

    const result = await compiledExpression.evaluate(envelope);

    expect(result.empty).toBeUndefined();
    expect(result.datasets).toHaveLength(2);
  });

  it("should accept year/month rows without dt_end and ignore null ac for scale", async () => {
    const rows = [
      {
        nr: "nr",
        year: 2026,
        month: 1,
        month_label: "JAN",
        ac: 153.1,
        ac_vs_ly: 30.3,
        ac_vs_bu: -0.3,
        ly: 110.7,
        bu: 150.4,
        variationDirectionVsLy: "up" as const,
        variationDirectionVsBu: "down" as const,
      },
      {
        nr: "nr",
        year: 2026,
        month: 2,
        month_label: "FEB",
        ac: null,
        ac_vs_ly: null,
        ac_vs_bu: null,
        ly: 108.8,
        bu: 140.8,
        variationDirectionVsLy: "up" as const,
        variationDirectionVsBu: "up" as const,
      },
    ];

    const result = await compiledExpression.evaluate({
      datasources: { "value-creation_pr-pages_volume_line-chart": rows },
    });

    expect(result.empty).toBeUndefined();
    expect(result.suggestedMin).toBeDefined();
    expect(result.suggestedMax).toBeDefined();
    expect(result.formattedData[0]).toEqual(["153.1", "-"]);
  });

  it("should include Budget dataset and vs BU comparison when BU is available", async () => {
    const entries: DatasourceEntry[] = [
      createEntry({
        dt_ini: "2025-01-01",
        dt_end: "2025-01-31",
        ac: 40,
        ac_vs_ly: null,
        bu: null,
        ac_vs_bu: null,
      }),
      createEntry({
        dt_ini: "2025-02-01",
        dt_end: "2025-02-28",
        ac: 45,
        ac_vs_ly: null,
        bu: null,
        ac_vs_bu: null,
      }),
      createEntry({
        dt_ini: "2026-01-01",
        dt_end: "2026-01-31",
        ac: 50,
        ac_vs_ly: 25,
        bu: 30,
        ac_vs_bu: 4.2,
        variationDirectionVsLy: "up",
        variationDirectionVsBu: "up",
      }),
      createEntry({
        dt_ini: "2026-02-01",
        dt_end: "2026-02-28",
        ac: 44,
        ac_vs_ly: -2,
        bu: 46,
        ac_vs_bu: -4.3,
        variationDirectionVsLy: "down",
        variationDirectionVsBu: "down",
      }),
      createEntry({
        dt_ini: "2026-03-01",
        dt_end: "2026-03-31",
        ac: 46,
        ac_vs_ly: 1.5,
        bu: 47,
        ac_vs_bu: "N/A",
        variationDirectionVsLy: "up",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));

    expect(result.datasets).toHaveLength(3);
    expect(result.datasets.map((dataset: any) => dataset.label)).toEqual([
      "Current Year",
      "Budget",
      "Previous Year",
    ]);
    expect(Array.isArray(result.formattedData)).toBe(true);
    expect(result.formattedData).toHaveLength(1);
    expect(Array.isArray(result.formattedData[0])).toBe(true);
    expect(result.formattedData[0]).toEqual(["50", "44", "46"]);

    expect(result.legend.map((item: any) => item.label)).toEqual([
      "Previous Year",
      "Budget",
      "Current Year",
    ]);

    expect(result.comparisonLine.data).toHaveLength(2);
    expect(result.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.comparisonLine.data[1].title).toBe("vs BU");

    expect(result.comparisonLine.data[0].data[0]).toEqual({
      value: "25.0",
      measure: "%",
      color: "#007800",
    });
    expect(result.comparisonLine.data[0].data[1]).toEqual({
      value: "-2.0",
      measure: "%",
      color: "#B91C1C",
    });

    expect(result.comparisonLine.data[1].data[0]).toEqual({
      value: "4.2",
      measure: "%",
      color: "#007800",
    });
    expect(result.comparisonLine.data[1].data[1]).toEqual({
      value: "-4.3",
      measure: "%",
      color: "#B91C1C",
    });
    expect(result.comparisonLine.data[1].data[2]).toEqual({
      value: "-",
    });

    expect(result.suggestedMin).toBe(20);
    expect(result.suggestedMax).toBe(60);
  });

  it("should use pp (not %) for vs LY when market_share KPI view is flagged", async () => {
    const entries: DatasourceEntry[] = [
      createEntry({
        dt_ini: "2025-01-01",
        dt_end: "2025-01-31",
        ac: 40,
        ac_vs_ly: null,
        bu: null,
        ac_vs_bu: null,
        kpi_name: "market_share",
      }),
      createEntry({
        dt_ini: "2026-01-01",
        dt_end: "2026-01-31",
        ac: 50,
        ac_vs_ly: 1.2,
        bu: null,
        ac_vs_bu: null,
        variationDirectionVsLy: "up",
        vol_ac_vs_ly: 3.4,
        variationDirectionVolVsLy: "up",
        kpi_name: "market_share",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));

    expect(result.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.comparisonLine.data[0].data[0]).toEqual({
      value: "1.2",
      measure: "pp",
      color: "#007800",
    });

    expect(result.comparisonLine.data[1].title).toBe("Vol. vs LY");
    expect(result.comparisonLine.data[1].data[0]).toEqual({
      value: "3.4",
      measure: "%",
      color: "#007800",
    });
  });

  it("should keep current behavior when BU is not available", async () => {
    const entries: DatasourceEntry[] = [
      createEntry({
        dt_ini: "2025-01-01",
        dt_end: "2025-01-31",
        ac: 40,
        ac_vs_ly: null,
        bu: null,
        ac_vs_bu: null,
      }),
      createEntry({
        dt_ini: "2025-02-01",
        dt_end: "2025-02-28",
        ac: 45,
        ac_vs_ly: null,
        bu: null,
        ac_vs_bu: null,
      }),
      createEntry({
        dt_ini: "2026-01-01",
        dt_end: "2026-01-31",
        ac: 50,
        ac_vs_ly: 25,
        bu: null,
        ac_vs_bu: null,
        variationDirectionVsLy: "up",
      }),
      createEntry({
        dt_ini: "2026-02-01",
        dt_end: "2026-02-28",
        ac: 44,
        ac_vs_ly: -2,
        bu: null,
        ac_vs_bu: null,
        variationDirectionVsLy: "down",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));

    expect(result.datasets).toHaveLength(2);
    expect(result.datasets.map((dataset: any) => dataset.label)).toEqual([
      "Current Year",
      "Previous Year",
    ]);
    expect(Array.isArray(result.formattedData)).toBe(true);
    expect(result.formattedData).toHaveLength(1);
    expect(Array.isArray(result.formattedData[0])).toBe(true);
    expect(result.formattedData[0]).toEqual(["50", "44"]);

    expect(result.legend.map((item: any) => item.label)).toEqual([
      "Previous Year",
      "Current Year",
    ]);

    expect(result.comparisonLine.data).toHaveLength(2);
    expect(result.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.comparisonLine.data[0].data[0]).toEqual({
      value: "25.0",
      measure: "%",
      color: "#007800",
    });
    expect(result.comparisonLine.data[0].data[1]).toEqual({
      value: "-2.0",
      measure: "%",
      color: "#B91C1C",
    });

    expect(result.comparisonLine.data[1].title).toBe("vs BU");
    result.comparisonLine.data[1].data.forEach((item: any) => {
      expect(item).toEqual({ value: "-" });
    });

    expect(result.suggestedMin).toBe(35);
    expect(result.suggestedMax).toBe(55);
  });

  it('should add NR/hl vs LY when NR view is flagged (nr = "nr") and per_hl_vs_ly is on rows', async () => {
    const entries: DatasourceEntry[] = [
      createEntry({
        dt_ini: "2025-01-01",
        dt_end: "2025-01-31",
        ac: 40,
        ac_vs_ly: null,
        bu: null,
        ac_vs_bu: null,
        nr: "nr",
      }),
      createEntry({
        dt_ini: "2026-01-01",
        dt_end: "2026-01-31",
        ac: 50,
        ac_vs_ly: 2,
        bu: null,
        ac_vs_bu: null,
        variationDirectionVsLy: "up",
        per_hl_vs_ly: 1.1,
        variationDirectionPerHlVsLy: "up",
        nr: "nr",
      }),
      createEntry({
        dt_ini: "2026-02-01",
        dt_end: "2026-02-28",
        ac: 48,
        ac_vs_ly: -1,
        bu: null,
        ac_vs_bu: null,
        variationDirectionVsLy: "down",
        per_hl_vs_ly: -0.5,
        variationDirectionPerHlVsLy: "down",
        nr: "nr",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));

    expect(result.comparisonLine.data).toHaveLength(3);
    expect(result.comparisonLine.data[2].title).toBe("NR/hl vs LY");
    expect(result.comparisonLine.data[2].data[0]).toEqual({
      value: "1.1",
      measure: "%",
      color: "#007800",
    });
    expect(result.comparisonLine.data[2].data[1]).toEqual({
      value: "-0.5",
      measure: "%",
      color: "#B91C1C",
    });
  });
});
