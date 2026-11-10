import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("category pos-performance-tool overview overtime-performance formatter", () => {
  const makeRow = (overrides: Record<string, unknown> = {}) => ({
    kpi: "participation_p4w",
    country: "BRA",
    category: "Beer",
    period_type: "R12M",
    source_type: "STANDARD",
    label_period: "Apr'25",
    dt_end: "2025-04-01",
    source_type_ly: "STANDARD",
    label_period_ly: "Apr'24",
    dt_end_ly: "2024-04-01",
    ac: 45.0,
    ly: 42.7,
    ac_vs_ly: 2.3,
    ac_vs_ly_pct: 5.4,
    ...overrides,
  });

  const wrapInput = (rows: Record<string, unknown>[]) => ({
    datasources: {
      "category_pos-performance-tool_overview_overtime-performance": rows,
    },
  });

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/pos-performance-tool/overview/overtime-performance.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiled = jsonata(expression);
    registerHelpers(compiled);
    return compiled;
  };

  it("should return empty flag when datasource has no data", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput([]));

    expect(result).toEqual({ "#empty": true });
  });

  it("should return three cards in the correct kpi_order", async () => {
    const rows = [
      makeRow({ kpi: "participation_p4w" }),
      makeRow({ kpi: "occasions", ac: 3.2, ac_vs_ly: 0.1, ac_vs_ly_pct: 3.2 }),
      makeRow({
        kpi: "servings",
        ac: 1.8,
        ac_vs_ly: -0.2,
        ac_vs_ly_pct: -10.0,
      }),
    ];

    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput(rows));

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[0].kpiKey).toBe("participation");
    expect(result[1].kpiKey).toBe("occasions");
    expect(result[2].kpiKey).toBe("servings");
  });

  it("should map participation_p4w to title Participation and kpiKey participation", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w" })]),
    );

    const card = result[0];
    expect(card.title).toBe("Participation");
    expect(card.kpiKey).toBe("participation");
    expect(card.dataTestId).toBe("participation");
  });

  it("should map occasions to title Occasions and kpiKey occasions", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "occasions" })]),
    );

    const card = result[1];
    expect(card.title).toBe("Occasions");
    expect(card.kpiKey).toBe("occasions");
  });

  it("should map servings to title Servings and kpiKey servings", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "servings" })]),
    );

    const card = result[2];
    expect(card.title).toBe("Servings");
    expect(card.kpiKey).toBe("servings");
  });

  it("should set trend positive when ac_vs_ly is positive", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w", ac_vs_ly: 2.3 })]),
    );

    expect(result[0].data[0].bigNumber.trend).toBe("positive");
  });

  it("should set trend negative when ac_vs_ly is negative", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w", ac_vs_ly: -1.5 })]),
    );

    expect(result[0].data[0].bigNumber.trend).toBe("negative");
  });

  it("should set trend positive when ac_vs_ly is zero", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w", ac_vs_ly: 0 })]),
    );

    expect(result[0].data[0].bigNumber.trend).toBe("positive");
  });

  it("should format period as quarter from dt_end", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w", dt_end: "2026-03-01" })]),
    );

    expect(result[0].period).toBe("Q1'26");
  });

  it("should set period to empty string when dt_end is missing", async () => {
    const row = makeRow({ kpi: "participation_p4w" });
    delete (row as any).dt_end;

    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput([row]));

    expect(result[0].period).toBe("");
  });

  it("should set measure from config for participation", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w" })]),
    );

    expect(result[0].measure).toBe("[%]");
  });

  it("should set measure from config for occasions", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "occasions" })]),
    );

    expect(result[1].measure).toBe("[#]");
  });

  it("should set measure from config for servings", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "servings" })]),
    );

    expect(result[2].measure).toBe("[%]");
  });

  it("should use participation comparison as FY period from dt_end_ly", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([
        makeRow({ kpi: "participation_p4w", dt_end_ly: "2024-04-01" }),
      ]),
    );

    expect(result[0].data[0].comparison).toEqual({
      label: "vs",
      value: "24'FY",
    });
  });

  it("should fall back comparison value to LY when dt_end_ly is missing for participation", async () => {
    const row = makeRow({ kpi: "participation_p4w" });
    delete (row as any).dt_end_ly;

    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput([row]));

    expect(result[0].data[0].comparison).toEqual({
      label: "vs",
      value: "LY",
    });
  });

  it("should use occasions comparison as formatted pct with vs YA label", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "occasions", ac_vs_ly_pct: -0.8 })]),
    );

    expect(result[1].data[0].comparison).toEqual({
      label: "vs YA",
      value: "-0.8%",
    });
  });

  it("should prefix + sign for positive pct comparison", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "servings", ac_vs_ly_pct: 4.3 })]),
    );

    expect(result[2].data[0].comparison).toEqual({
      label: "vs YA",
      value: "+4.3%",
    });
  });

  it("should use % as default bigNumber measure unit", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w" })]),
    );

    expect(result[0].data[0].bigNumber.measure).toBe("%");
  });

  it("should use comp_unit_of_measure when provided", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([
        makeRow({ kpi: "participation_p4w", comp_unit_of_measure: "pp" }),
      ]),
    );

    expect(result[0].data[0].bigNumber.measure).toBe("pp");
  });

  it("should show ac as secondaryInfo value", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w", ac: 45.0 })]),
    );

    expect(result[0].data[0].secondaryInfo.value).toBe("45.0");
  });

  it("should use per-KPI label for participation secondaryInfo", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w" })]),
    );

    expect(result[0].data[0].secondaryInfo.label).toBe("[ % ]");
  });

  it("should use per-KPI label for occasions secondaryInfo", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "occasions" })]),
    );

    expect(result[1].data[0].secondaryInfo.label).toBe("[ # ]");
  });

  it("should use per-KPI label for servings secondaryInfo", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "servings" })]),
    );

    expect(result[2].data[0].secondaryInfo.label).toBe("[ # ]");
  });

  it("should return empty data array for a kpi not present in datasource", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ kpi: "participation_p4w" })]),
    );

    expect(result[1].data).toEqual([]);
    expect(result[2].data).toEqual([]);
  });

  it("should use kpi_label from datasource over config title when provided", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([
        makeRow({ kpi: "participation_p4w", kpi_label: "P4W Participation" }),
      ]),
    );

    expect(result[0].title).toBe("P4W Participation");
  });
});
