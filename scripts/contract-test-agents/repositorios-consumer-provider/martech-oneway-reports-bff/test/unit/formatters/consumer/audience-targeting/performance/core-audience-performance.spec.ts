import fs from "fs";
import path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("Core Audience Performance Formatter (JSONata)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/consumer/audience-targeting/performance/core-audience-performance.jsonata",
  );

  const DS_KEY =
    "consumer_audience-targeting_performance_core-audience-performance";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  const ensureArray = (result: any) =>
    Array.isArray(result) ? result : [result];

  it("returns all three KPI slots as empty when datasource has no data", async () => {
    const result: any = await evaluate([]);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: "participation",
      empty: true,
      performanceIndex: {
        value: "",
        variation: "neutral",
      },
      bigNumberData: [],
    });
    expect(result[1]).toEqual({
      id: "occasions",
      empty: true,
      performanceIndex: {
        value: "",
        variation: "neutral",
      },
      bigNumberData: [],
    });
    expect(result[2]).toEqual({
      id: "brandPower",
      empty: true,
      performanceIndex: {
        value: "",
        variation: "neutral",
      },
      bigNumberData: [],
    });
  });

  it("formats all three KPI groups in correct order", async () => {
    const mockData = [
      {
        nm_group: "Participation",
        coreaudiencevstotal: 105.3,
        corevsly: 2.5,
        brandvsly: 1.2,
      },
      {
        nm_group: "Occasions",
        coreaudiencevstotal: 98.7,
        corevsly: -1.3,
        brandvsly: 0.5,
      },
      {
        nm_group: "Brand Power",
        coreaudiencevstotal: 110.0,
        corevsly: 3.0,
        brandvsly: 3.0,
      },
    ];

    const result: any = await evaluate(mockData);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("participation");
    expect(result[1].id).toBe("occasions");
    expect(result[2].id).toBe("brandPower");
  });

  it("formats performanceIndex variation from coreaudiencevstotal index bands via getIndexColor", async () => {
    const mockData = [
      {
        nm_group: "Participation",
        coreaudiencevstotal: 105.3,
        corevsly: 2.5,
        brandvsly: 1.2,
      },
    ];

    const result: any = ensureArray(await evaluate(mockData));

    expect(result[0].performanceIndex.variation).toBe("up");
  });

  it("uses index bands for performanceIndex even when core YoY is positive", async () => {
    const mockData = [
      {
        nm_group: "Participation",
        coreaudiencevstotal: 100,
        corevsly: 5,
        brandvsly: 1.2,
      },
    ];

    const result: any = ensureArray(await evaluate(mockData));

    expect(result[0].performanceIndex.variation).toBe("neutral");
  });

  it("sets performanceIndex variation from index bands for Occasions (not YoY)", async () => {
    const mockData = [
      {
        nm_group: "Occasions",
        coreaudiencevstotal: 98.7,
        corevsly: -1.3,
        brandvsly: 0.5,
      },
    ];

    const result: any = ensureArray(await evaluate(mockData));
    const occasions = result.find((item: any) => item.id === "occasions");

    expect(occasions.performanceIndex.variation).toBe("neutral");
  });

  it("sets performanceIndex variation from index when core YoY is zero", async () => {
    const mockData = [
      {
        nm_group: "Brand Power",
        coreaudiencevstotal: 110.0,
        corevsly: 0,
        brandvsly: 3.0,
      },
    ];

    const result: any = ensureArray(await evaluate(mockData));
    const brandPower = result.find((item: any) => item.id === "brandPower");

    expect(brandPower.performanceIndex.variation).toBe("up");
  });

  it("formats bigNumberData with core and brand entries", async () => {
    const mockData = [
      {
        nm_group: "Participation",
        coreaudiencevstotal: 105.3,
        corevsly: 2.5,
        brandvsly: -1.2,
      },
    ];

    const result: any = ensureArray(await evaluate(mockData));
    const bigNumbers = result[0].bigNumberData;

    expect(bigNumbers).toHaveLength(2);

    expect(bigNumbers[0].id).toBe("core");
    expect(bigNumbers[0].measure).toBe("pp");
    expect(bigNumbers[0].variation).toBe("up");

    expect(bigNumbers[1].id).toBe("brand");
    expect(bigNumbers[1].measure).toBe("pp");
    expect(bigNumbers[1].variation).toBe("down");
  });

  it("keeps missing groups as empty slots", async () => {
    const mockData = [
      {
        nm_group: "Participation",
        coreaudiencevstotal: 100,
        corevsly: 1.0,
        brandvsly: 1.0,
      },
    ];

    const result: any = ensureArray(await evaluate(mockData));

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("participation");
    expect(result[0].empty).toBeUndefined();
    expect(result[1]).toEqual({
      id: "occasions",
      empty: true,
      performanceIndex: {
        value: "",
        variation: "neutral",
      },
      bigNumberData: [],
    });
    expect(result[2]).toEqual({
      id: "brandPower",
      empty: true,
      performanceIndex: {
        value: "",
        variation: "neutral",
      },
      bigNumberData: [],
    });
  });

  it("handles null numeric values with neutral variation", async () => {
    const mockData = [
      {
        nm_group: "Participation",
        coreaudiencevstotal: null,
        corevsly: null,
        brandvsly: null,
      },
    ];

    const result: any = ensureArray(await evaluate(mockData));

    expect(result[0].performanceIndex.variation).toBe("neutral");
    expect(result[0].bigNumberData[0].variation).toBe("neutral");
    expect(result[0].bigNumberData[1].variation).toBe("neutral");
    expect(result[0].bigNumberData[0].measure).toBe("");
    expect(result[0].bigNumberData[1].measure).toBe("");
  });
});
