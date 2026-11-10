import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("powerVsLyExportFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book-export/bigNumbers/powerVsLyExportFormatter/powerVsLyExportFormatter.jsonata",
  );

  const DS_KEY = "power_vs_ly";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = async (bigNumbers: any[]) => {
    const raw = await compiledExpression.evaluate({
      datasources: { [DS_KEY]: bigNumbers },
    });

    return JSON.parse(JSON.stringify(raw));
  };

  const buildRow = (overrides: Record<string, any> = {}) => ({
    ac: 53.34,
    ac_vs_ly: 0.57,
    dt_end: "2025-09-30T00:00:00.000Z",
    variationDirectionVsLy: "up",
    ...overrides,
  });

  it("should return empty state when datasource is empty", async () => {
    const result = await evaluate([]);

    expect(result).toEqual({
      header: { title: "Power vs LY" },
      empty: true,
    });
  });

  it("should return empty state when datasource key is missing", async () => {
    const result = await compiledExpression.evaluate({
      datasources: {},
    });

    expect(result).toEqual({
      header: { title: "Power vs LY" },
      empty: true,
    });
  });

  it("should format a positive power vs LY big number", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result).toEqual({
      header: { title: "Power vs LY" },
      data: [
        {
          bigNumber: {
            value: "0.6",
            measure: "pp",
            color: "#007800",
          },
          secondaryInfo: {
            value: "#: 53.3",
            label: "[%]",
          },
          comparison: {
            label: "vs",
            value: "Q3'24",
          },
        },
      ],
    });
  });

  it("should format a negative power vs LY big number with down color", async () => {
    const result: any = await evaluate([
      buildRow({
        ac: 49.95,
        ac_vs_ly: -1.24,
        dt_end: "2025-09-30T00:00:00.000Z",
        variationDirectionVsLy: "down",
      }),
    ]);

    expect(result.data[0].bigNumber).toEqual({
      value: "-1.2",
      measure: "pp",
      color: "#B91C1C",
    });
    expect(result.data[0].secondaryInfo).toEqual({
      value: "#: 50.0",
      label: "[%]",
    });
    expect(result.data[0].comparison).toEqual({
      label: "vs",
      value: "Q3'24",
    });
  });

  it("should format total values with thousands separator", async () => {
    const result: any = await evaluate([
      buildRow({
        ac: 1234.56,
      }),
    ]);

    expect(result.data[0].secondaryInfo.value).toBe("#: 1,234.6");
  });
});
