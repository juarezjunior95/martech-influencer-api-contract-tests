import fs from "fs";
import path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("Breakdown Formatter - Performance (JSONata)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/consumer/audience-targeting/performance/breakdown.jsonata",
  );

  const DS_KEY = "consumer_audience-targeting_performance_breakdown";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({
      datasources: { [DS_KEY]: data },
    });

  const ensureArray = (result: any) =>
    Array.isArray(result) ? result : [result];

  const tier = (result: any[], tierLevel: string) =>
    ensureArray(result).find((r) => r.tier_level === tierLevel);

  const createRow = (overrides: Record<string, any> = {}) => ({
    entity_type: "Brand",
    entity_name: "Bud Light",
    core_ac: 45.2,
    core_vs_ly: 2.1,
    core_index: 105,
    halo_ac: 30.5,
    halo_vs_ly: -1.3,
    halo_index: 95,
    total_ac: 75.7,
    total_vs_ly: 0.8,
    total_index: 100,
    ...overrides,
  });

  it("returns fallback when datasource has no data", async () => {
    const result: any = ensureArray(await evaluate([]));

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      tier_level: "beer",
      tier_name: "Beer",
      empty: true,
    });
    expect(result[1]).toEqual({
      tier_level: "core_co",
      tier_name: "Core Co",
      empty: true,
    });
    expect(result[2]).toEqual({
      tier_level: "brand",
      tier_name: "Brand",
      empty: true,
    });
    expect(result[3]).toEqual({
      tier_level: "competitor",
      tier_name: "Competitor",
      empty: true,
    });
  });

  it("maps tier types to correct tier levels", async () => {
    const mockData = [
      createRow({ entity_type: "Beer", entity_name: "Beer Category" }),
      createRow({ entity_type: "Core Co", entity_name: "Core Company" }),
      createRow({ entity_type: "Brand", entity_name: "Bud Light" }),
      createRow({ entity_type: "Competitor", entity_name: "Miller Lite" }),
    ];

    const result: any = await evaluate(mockData);

    expect(result).toHaveLength(4);
    expect(result[0].tier_level).toBe("beer");
    expect(result[0].tier_name).toBe("Beer Category");
    expect(result[1].tier_level).toBe("core_co");
    expect(result[1].tier_name).toBe("Core Company");
    expect(result[2].tier_level).toBe("brand");
    expect(result[2].tier_name).toBe("Bud Light");
    expect(result[3].tier_level).toBe("competitor");
    expect(result[3].tier_name).toBe("Miller Lite");
  });

  it("builds audience objects with core, halo, and total", async () => {
    const mockData = [createRow()];

    const result: any = ensureArray(await evaluate(mockData));
    const audiences = tier(result, "brand")!.audiences;

    expect(audiences.core).toBeDefined();
    expect(audiences.core.value).toBe("45.2");
    expect(audiences.core.yoy_change).toBe("2.1");
    expect(audiences.core.yoy_direction).toBe("up");
    expect(audiences.core.performance_index).toBe("105.0");
    expect(audiences.core.comparison_index).toBe("105.0");

    expect(audiences.halo).toBeDefined();
    expect(audiences.halo.value).toBe("30.5");
    expect(audiences.halo.yoy_change).toBe("-1.3");
    expect(audiences.halo.yoy_direction).toBe("down");
    expect(audiences.halo.performance_index).toBe("95.0");
    expect(audiences.halo.comparison_index).toBe("95.0");

    expect(audiences.total).toBeDefined();
    expect(audiences.total.value).toBe("75.7");
    expect(audiences.total.yoy_change).toBe("0.8");
    expect(audiences.total.yoy_direction).toBe("up");
    expect(audiences.total.performance_index).toBe("100.0");
    expect(audiences.total.comparison_index).toBe("100.0");
  });

  it("includes performance_index and comparison_index with formatted strings", async () => {
    const mockData = [createRow()];

    const result: any = ensureArray(await evaluate(mockData));
    const audiences = tier(result, "brand")!.audiences;

    expect(audiences.core).toEqual({
      value: "45.2",
      yoy_change: "2.1",
      yoy_direction: "up",
      performance_index: "105.0",
      comparison_index: "105.0",
    });
    expect(audiences.halo).toEqual({
      value: "30.5",
      yoy_change: "-1.3",
      yoy_direction: "down",
      performance_index: "95.0",
      comparison_index: "95.0",
    });
    expect(audiences.total).toEqual({
      value: "75.7",
      yoy_change: "0.8",
      yoy_direction: "up",
      performance_index: "100.0",
      comparison_index: "100.0",
    });
  });

  it("sets yoy_direction to neutral when value is zero", async () => {
    const mockData = [createRow({ core_vs_ly: 0 })];

    const result: any = ensureArray(await evaluate(mockData));

    expect(tier(result, "brand")!.audiences.core.yoy_direction).toBe("neutral");
  });

  it("marks tier as empty when all audience ac values are null", async () => {
    const mockData = [
      createRow({
        core_ac: null,
        core_vs_ly: null,
        core_index: null,
        halo_ac: null,
        halo_vs_ly: null,
        halo_index: null,
        total_ac: null,
        total_vs_ly: null,
        total_index: null,
      }),
    ];

    const result: any = ensureArray(await evaluate(mockData));
    const brandTier = tier(result, "brand")!;

    expect(brandTier.empty).toBe(true);
    expect(brandTier.audiences).toBeUndefined();
  });

  it("keeps missing tiers as empty when rows are missing from datasource", async () => {
    const mockData = [
      createRow({ entity_type: "Brand", entity_name: "Bud Light" }),
    ];

    const result: any = ensureArray(await evaluate(mockData));

    expect(result).toHaveLength(4);
    expect(tier(result, "brand")!.tier_name).toBe("Bud Light");
    expect(tier(result, "brand")!.audiences).toBeDefined();
    expect(tier(result, "beer")!.empty).toBe(true);
    expect(tier(result, "core_co")!.empty).toBe(true);
    expect(tier(result, "competitor")!.empty).toBe(true);
  });

  it("preserves tier order from config regardless of input order", async () => {
    const mockData = [
      createRow({ entity_type: "Competitor", entity_name: "Miller Lite" }),
      createRow({ entity_type: "Beer", entity_name: "Beer Category" }),
      createRow({ entity_type: "Brand", entity_name: "Bud Light" }),
    ];

    const result: any = ensureArray(await evaluate(mockData));

    expect(result).toHaveLength(4);
    expect(result[0].tier_level).toBe("beer");
    expect(result[1].tier_level).toBe("core_co");
    expect(result[2].tier_level).toBe("brand");
    expect(result[3].tier_level).toBe("competitor");
  });

  it("sends yoy_change as N/A when vs ly is null", async () => {
    const mockData = [createRow({ core_vs_ly: null })];

    const result: any = ensureArray(await evaluate(mockData));
    const brandAudiences = tier(result, "brand")!.audiences!;

    expect(brandAudiences.core.yoy_change).toBe("N/A");
    expect(brandAudiences.halo.yoy_change).toBe("-1.3");
  });

  it("formats chart and vs ly metrics with one decimal place", async () => {
    const mockData = [createRow({ core_ac: 45, core_vs_ly: 2 })];

    const result: any = ensureArray(await evaluate(mockData));
    const brandAudiences = tier(result, "brand")!.audiences!;

    expect(brandAudiences.core.value).toBe("45.0");
    expect(brandAudiences.core.yoy_change).toBe("2.0");
  });

  it("sets performance_index to N/A and comparison_index to dash when index is not a number", async () => {
    const mockData = [createRow({ core_index: "N/A", halo_index: undefined })];

    const result: any = ensureArray(await evaluate(mockData));
    const brandAudiences = tier(result, "brand")!.audiences!;

    expect(brandAudiences.core.performance_index).toBe("N/A");
    expect(brandAudiences.core.comparison_index).toBe("-");
    expect(brandAudiences.halo.performance_index).toBe("N/A");
    expect(brandAudiences.halo.comparison_index).toBe("-");
  });

  it("formats indexes with one decimal place", async () => {
    const mockData = [
      createRow({ core_index: 105, halo_index: 95, total_index: 100 }),
    ];

    const result: any = ensureArray(await evaluate(mockData));
    const brandAudiences = tier(result, "brand")!.audiences!;

    expect(brandAudiences.core.performance_index).toBe("105.0");
    expect(brandAudiences.core.comparison_index).toBe("105.0");
    expect(brandAudiences.halo.performance_index).toBe("95.0");
    expect(brandAudiences.halo.comparison_index).toBe("95.0");
    expect(brandAudiences.total.performance_index).toBe("100.0");
    expect(brandAudiences.total.comparison_index).toBe("100.0");
  });
});
