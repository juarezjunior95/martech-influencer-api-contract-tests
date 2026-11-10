import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("category-overview formatter (value-creation overview)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/overview/category-overview.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return growthLevers with expected structure from full input", async () => {
    const beerParticipation = [
      {
        kpi_name: "p7d",
        ac: 27.1,
        value: -0.9,
        comp_direction: "down",
        refreshMonthLabel: "Dec'25",
        lyMonthLabel: "Dec'24",
      },
      {
        kpi_name: "p4w",
        ac: 43.3,
        value: -0.9,
        comp_direction: "down",
        refreshMonthLabel: "Dec'25",
        lyMonthLabel: "Dec'24",
      },
    ];
    const superiorCore = [
      {
        kpi_name: "volume",
        mix: 64.9,
        value: -3.1,
        comp_direction: "down",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
      {
        kpi_name: "nr",
        mix: 57.1,
        value: -0.5,
        comp_direction: "down",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
    ];
    const occasions = [
      {
        kpi_name: "volume",
        mix: 1,
        value: 18.2,
        comp_direction: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
      {
        kpi_name: "nr",
        mix: 1.3,
        value: 17.4,
        comp_direction: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
    ];
    const premiumization = [
      {
        kpi_name: "volume",
        mix: 33,
        value: 5,
        comp_direction: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
      {
        kpi_name: "nr",
        mix: 39.5,
        value: 9.2,
        comp_direction: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
    ];
    const beyondBeer = [
      {
        kpi_name: "volume",
        mix: 2,
        value: 20.2,
        comp_direction: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
      {
        kpi_name: "nr",
        mix: 3.4,
        value: 30.7,
        comp_direction: "up",
        refreshMonthLabel: "Jan'26",
        lyMonthLabel: "Jan'25",
      },
    ];

    const mockInput = {
      components: [
        {
          data: {
            datasources: {
              "value-creation_portfolio-performance_overview_category-growth-levers_beer-participation":
                beerParticipation,
              "value-creation_portfolio-performance_overview_category-growth-levers_superior-core":
                superiorCore,
              "value-creation_portfolio-performance_overview_category-growth-levers_occasions-development":
                occasions,
              "value-creation_portfolio-performance_overview_category-growth-levers_premiumization":
                premiumization,
              "value-creation_portfolio-performance_overview_category-growth-levers_beyond-beer":
                beyondBeer,
            },
          },
        },
      ],
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("growthLevers");
    expect(Array.isArray(result.growthLevers)).toBe(true);
    expect(result.growthLevers).toHaveLength(5);

    const beer = result.growthLevers[0];
    expect(beer.title).toBe("Beer Participation");
    expect(beer.versus).toBe("vs Q4'24 YTD");
    expect(beer.kpi_name).toBe("p7d");
    expect(beer.dateRefresh).toBe("Q4'25");
    expect(Array.isArray(beer.kpi.header)).toBe(true);
    expect(beer.kpi.header[1].title).toBe("TT ABI");
    expect(Array.isArray(beer.kpi.rows)).toBe(true);
    const beerRows = beer.kpi.rows;
    expect(beerRows).toHaveLength(2);
    expect(beerRows[0].label).toBe("P7D");
    expect(beerRows[0].mix.value).toBe("27.1");
    expect(beerRows[0].vsLy.value).toBe("-0.9");
    expect(beerRows[0].vsLy.unitOfMeasure).toBe("pp");
    expect(beerRows[1].label).toBe("P4W");
    expect(beerRows[1].mix.value).toBe("43.3");

    const superior = result.growthLevers[1];
    expect(superior.title).toBe("Superior Core");
    expect(superior.versus).toBe("vs Jan'25 YTD");
    expect(superior.dateRefresh).toBe("Jan'26");
    expect(Array.isArray(superior.kpi.header)).toBe(true);
    expect(superior.kpi.header[1].title).toBe("MIX");
    expect(Array.isArray(superior.kpi.rows)).toBe(true);
    const superiorRows = superior.kpi.rows;
    expect(superiorRows[0].label).toBe("Vol");
    expect(superiorRows[0].mix.value).toBe("64.9");
    expect(superiorRows[1].label).toBe("NR");
    expect(superiorRows[1].mix.value).toBe("57.1");
    expect(superior.footerInfo).toBeUndefined();

    const balanced = result.growthLevers[2];
    expect(balanced.title).toBe("Balanced Choices");
    expect(balanced.footerInfo).toBe("Non-Alc Beer");
    expect(Array.isArray(balanced.kpi.rows)).toBe(true);
    const balancedRows = balanced.kpi.rows;
    expect(balancedRows[0].mix.value).toBe("1.0");
    expect(balancedRows[0].vsLy.value).toBe("18.2");

    expect(result.growthLevers[3].title).toBe("Lead Premium");
    expect(result.growthLevers[4].title).toBe("Beyond Beer");
  });

  it("should accept input via root datasources", async () => {
    const mockInput = {
      datasources: {
        "value-creation_portfolio-performance_overview_category-growth-levers_beer-participation":
          [
            {
              kpi_name: "p7d",
              ac: 10,
              value: 1,
              comp_direction: "up",
              refreshMonthLabel: "Dec'25",
              lyMonthLabel: "Dec'24",
            },
          ],
        "value-creation_portfolio-performance_overview_category-growth-levers_superior-core":
          [],
        "value-creation_portfolio-performance_overview_category-growth-levers_occasions-development":
          [],
        "value-creation_portfolio-performance_overview_category-growth-levers_premiumization":
          [],
        "value-creation_portfolio-performance_overview_category-growth-levers_beyond-beer":
          [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.growthLevers).toBeDefined();
    expect(result.growthLevers.length).toBeGreaterThanOrEqual(1);
    const beer = result.growthLevers[0];
    expect(beer.title).toBe("Beer Participation");
    expect(Array.isArray(beer.kpi?.header)).toBe(true);
    expect(Array.isArray(beer.kpi?.rows)).toBe(true);
    const firstRow = beer.kpi.rows[0];
    expect(firstRow).toBeDefined();
    expect(firstRow.label).toBe("P7D");
    expect(firstRow.mix.value).toBe("10.0");
  });

  it("should coerce a single growth-lever row object into one kpi row", async () => {
    const result = await compiledExpression.evaluate({
      datasources: {
        "value-creation_portfolio-performance_overview_category-growth-levers_beer-participation":
          {
            kpi_name: "p7d",
            ac: 26.9,
            value: -0.9,
            comp_direction: "down",
            refreshMonthLabel: "Dec'25",
            lyMonthLabel: "Dec'24",
          },
        "value-creation_portfolio-performance_overview_category-growth-levers_superior-core":
          [],
        "value-creation_portfolio-performance_overview_category-growth-levers_occasions-development":
          [],
        "value-creation_portfolio-performance_overview_category-growth-levers_premiumization":
          [],
        "value-creation_portfolio-performance_overview_category-growth-levers_beyond-beer":
          [],
      },
    });

    expect(result.growthLevers).toHaveLength(1);
    expect(result.growthLevers[0].kpi.rows).toHaveLength(1);
    expect(result.growthLevers[0].kpi.rows[0].label).toBe("P7D");
    expect(result.growthLevers[0].kpi.rows[0].mix.value).toBe("26.9");
    expect(Array.isArray(result.growthLevers[0].kpi.header)).toBe(true);
    expect(Array.isArray(result.growthLevers[0].kpi.rows)).toBe(true);
  });

  it("should return empty growthLevers when datasources are missing", async () => {
    const result = await compiledExpression.evaluate({ datasources: {} });

    expect(result).toHaveProperty("growthLevers");
    const levers = Array.isArray(result.growthLevers)
      ? result.growthLevers.filter(Boolean)
      : [];
    expect(levers).toHaveLength(0);
  });
});
