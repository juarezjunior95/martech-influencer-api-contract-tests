import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("powerVsLyFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/power-book-overview/powerVsLyFormatter.jsonata",
  );

  const DS_KEY = "power_vs_ly_ds";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  it("should return empty state when datasource is empty", async () => {
    const result: any = await evaluate([]);
    expect(result).toEqual({ title: "Power vs LY", empty: true });
  });

  it("should format a positive power vs LY big number", async () => {
    const result: any = await evaluate({
      ac: 53.3,
      ac_vs_ly: 0.4,
      dt_end: "2025-09-30T00:00:00.000Z",
    });

    expect(result.title).toBe("Power vs LY");
    expect(result.bigNumber).toBe(0.4);
    expect(result.bigNumberUnit).toBe("pp");
    expect(result.bigNumberDirection).toBe("up");
    expect(result.bigNumberColor).toBe("#E6F9E6");
    expect(result.versus).toMatch(/^vs Q\d'\d{2}$/);
    expect(result.total).toBe(53.3);
    expect(result.totalPrefix).toBe("#:");
    expect(result.totalMeasure).toBe("[%]");
    expect(result.dateRefresh).toMatch(/^Q\d'\d{2}$/);
  });

  it("should format a negative power vs LY big number", async () => {
    const result: any = await evaluate({
      ac: 50.1,
      ac_vs_ly: -1.2,
      dt_end: "2025-09-30T00:00:00.000Z",
    });

    expect(result.bigNumberDirection).toBe("down");
    expect(result.bigNumberColor).toBe("#FFE6E6");
    expect(result.bigNumber).toBe(-1.2);
  });

  it("should use green color for zero ac_vs_ly", async () => {
    const result: any = await evaluate({
      ac: 50.0,
      ac_vs_ly: 0,
      dt_end: "2025-09-30T00:00:00.000Z",
    });

    expect(result.bigNumberDirection).toBe("down");
    expect(result.bigNumberColor).toBe("#E6F9E6");
  });
});
