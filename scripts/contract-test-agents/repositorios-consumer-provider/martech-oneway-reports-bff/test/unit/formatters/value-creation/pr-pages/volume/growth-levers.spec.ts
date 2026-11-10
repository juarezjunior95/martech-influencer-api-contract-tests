import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("PR Pages Volume - growth-levers formatter - JSONata Output", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/growth-levers.jsonata",
  );

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  function buildRows(pageType: string, priorities: string[]) {
    const periods = ["M", "L3M", "YTD"];
    return priorities.flatMap((priority) =>
      periods.map((period) => ({
        page_type: pageType,
        priorities: priority,
        period,
        ac_vs_ly: 1.5,
        variationDirectionVsLy: "up",
      })),
    );
  }

  function createInput(dsName: string, data: any[]) {
    return { datasources: { [dsName]: data } };
  }

  const DS_NAME = "value-creation_pr-pages_volume_growth-levers";

  it("should format Growth Levers Global with the official 4 rows", async () => {
    const rows = buildRows("Growth Levers Global", [
      "Superior Core",
      "Lead Premium",
      "Balanced Choices",
      "Beyond Beer",
    ]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header[0].title).toBe("Growth Levers");
    expect(result.rows[0].length).toBe(4);
    expect(result.rows[0][0].priorities.value).toBe("Superior Core");
    expect(result.rows[0][1].priorities.value).toBe("Lead Premium");
    expect(result.rows[0][2].priorities.value).toBe("Balanced Choices");
    expect(result.rows[0][3].priorities.value).toBe("Beyond Beer");
  });

  it("should format Growth Levers Country with same structure", async () => {
    const rows = buildRows("Growth Levers Country", [
      "Superior Core",
      "Lead Premium",
      "Balanced Choices",
      "Beyond Beer",
    ]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header[0].title).toBe("Growth Levers");
    expect(result.rows[0].length).toBe(4);
  });

  it("should remap legacy Non Alc Beer to Balanced Choices and ignore unsupported growth lever rows", async () => {
    const rows = buildRows("Growth Levers Global", [
      "Superior Core",
      "Lead Premium",
      "Global Brands",
      "Non Alc Beer",
      "Beyond Beer",
    ]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    const rowValues = result.rows[0].map((row: any) => row.priorities.value);

    expect(rowValues).toEqual([
      "Superior Core",
      "Lead Premium",
      "Balanced Choices",
      "Beyond Beer",
    ]);
  });

  it("should format Superior Core with 2 rows and Priorities header", async () => {
    const rows = buildRows("Superior Core", ["Value", "Core"]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header[0].title).toBe("Priorities");
    expect(result.rows[0].length).toBe(2);
    expect(result.rows[0][0].priorities.value).toBe("Value");
    expect(result.rows[0][1].priorities.value).toBe("Core");
  });

  it("should format Lead Premium with 3 rows and Priorities header", async () => {
    const rows = buildRows("Lead Premium", [
      "Global Brands",
      "Local Core Plus",
      "Local Prem/SP",
    ]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header[0].title).toBe("Priorities");
    expect(result.rows[0].length).toBe(3);
    expect(result.rows[0][0].priorities.value).toBe("Global Brands");
    expect(result.rows[0][1].priorities.value).toBe("Local Core Plus");
    expect(result.rows[0][2].priorities.value).toBe("Local Prem/SP");
  });

  it("should format Beyond Beer with Expansion Brands header", async () => {
    const brands = [
      "Flying Fish",
      "Brutal Fruit",
      "Cutwater",
      "Beats",
      "Nutrl",
      "Mike's",
      "Total",
    ];
    const rows = buildRows("Beyond Beer", brands);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header[0].title).toBe("Expansion Brands");
    expect(result.rows[0].length).toBe(7);
    expect(result.rows[0][0].priorities.value).toBe("Flying Fish");
    expect(result.rows[0][6].priorities.value).toBe("Total");
  });

  it("should format Non Alcoholic with 4 rows", async () => {
    const rows = buildRows("Non Alcoholic", [
      "Corona Cero",
      "Michelob Ultra Zero",
      "Stella Zero",
      "Budweiser Zero",
    ]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header[0].title).toBe("Priorities");
    expect(result.rows[0].length).toBe(4);
    expect(result.rows[0][0].priorities.value).toBe("Corona Cero");
    expect(result.rows[0][3].priorities.value).toBe("Budweiser Zero");
  });

  it("should format Global Brands with 4 rows and Global Brands header", async () => {
    const rows = buildRows("Global Brands", [
      "Corona",
      "Budweiser",
      "Stella Artois",
      "Michelob Ultra",
    ]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.header[0].title).toBe("Global Brands");
    expect(result.rows[0].length).toBe(4);
    expect(result.rows[0][0].priorities.value).toBe("Corona");
    expect(result.rows[0][3].priorities.value).toBe("Michelob Ultra");
  });

  it("should map cell data with ac_vs_ly and variationDirection", async () => {
    const rows = [
      {
        page_type: "Superior Core",
        priorities: "Value",
        period: "M",
        ac_vs_ly: 3.2,
        variationDirectionVsLy: "up",
      },
      {
        page_type: "Superior Core",
        priorities: "Value",
        period: "YTD",
        ac_vs_ly: -1.5,
        variationDirectionVsLy: "down",
      },
    ];
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.rows[0][0].mtd.value).toBe(3.2);
    expect(result.rows[0][0].mtd.unitMeasure).toBe("%");
    expect(result.rows[0][0].mtd.variationDirection).toBe("#007800");
    expect(result.rows[0][0].ytd.value).toBe(-1.5);
    expect(result.rows[0][0].ytd.variationDirection).toBe("#B91C1C");
    expect(result.rows[0][0].l3m.value).toBe("-");
  });

  it("should return empty when datasource has no rows", async () => {
    const input = createInput(DS_NAME, []);
    const result = await compiledExpression.evaluate(input);

    expect(result.empty).toBe(true);
  });

  it("should use price_tier field when priorities field is absent", async () => {
    const rows = [
      {
        page_type: "Superior Core",
        price_tier: "Value",
        period: "M",
        ac_vs_ly: 2.0,
        variationDirectionVsLy: "up",
      },
      {
        page_type: "Superior Core",
        price_tier: "Core",
        period: "M",
        ac_vs_ly: 1.0,
        variationDirectionVsLy: "down",
      },
    ];
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    expect(result.rows[0].length).toBe(2);
    expect(result.rows[0][0].priorities.value).toBe("Value");
    expect(result.rows[0][1].priorities.value).toBe("Core");
  });

  it("should preserve row order from SQL (not alphabetical)", async () => {
    const rows = buildRows("Growth Levers Global", [
      "Beyond Beer",
      "Balanced Choices",
      "Lead Premium",
      "Superior Core",
    ]);
    const input = createInput(DS_NAME, rows);
    const result = await compiledExpression.evaluate(input);

    const rowValues = result.rows[0].map((r: any) => r.priorities.value);
    expect(rowValues).toEqual([
      "Superior Core",
      "Lead Premium",
      "Balanced Choices",
      "Beyond Beer",
    ]);
  });
});
