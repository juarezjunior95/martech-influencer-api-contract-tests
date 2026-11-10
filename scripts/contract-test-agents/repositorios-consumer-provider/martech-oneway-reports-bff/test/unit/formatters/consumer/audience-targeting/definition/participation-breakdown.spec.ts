import fs from "fs";
import path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("Participation Breakdown Formatter - Definition (JSONata)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/consumer/audience-targeting/definition/participation-breakdown.jsonata",
  );

  const DS_KEY =
    "consumer_audience-targeting_definition_participation-breakdown";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  const createRow = (overrides: Record<string, any> = {}) => ({
    cohort_level: "Male",
    category_ac: 59.2,
    price_tier_ac: 60.2,
    price_tier_index: 102,
    brand_ac: 61.2,
    brand_index: 102,
    competitor_ac: 60.0,
    competitor_index: 100,
    price_tier: "CORE CO",
    brand: "Brahma",
    competitor: "Amstel",
    ...overrides,
  });

  it("groups rows by Gender, Age, and Income", async () => {
    const mockData = [
      createRow({ cohort_level: "Male" }),
      createRow({ cohort_level: "Female" }),
      createRow({ cohort_level: "25-34" }),
      createRow({ cohort_level: "High Income" }),
    ];

    const result: any = await evaluate(mockData);

    expect(result.rows).toHaveLength(3);

    const [genderGroup, ageGroup, incomeGroup] = result.rows;

    expect(genderGroup).toHaveLength(2);
    expect(genderGroup[0].rowGroup).toBe("Gender");
    expect(genderGroup[0].rowGroupLabel).toBe("Gender");
    expect(genderGroup[0].segment.value).toBe("Male");
    expect(genderGroup[1].rowGroup).toBe("Gender");
    expect(genderGroup[1].rowGroupLabel).toBeUndefined();
    expect(genderGroup[1].segment.value).toBe("Female");

    expect(ageGroup).toHaveLength(1);
    expect(ageGroup[0].rowGroup).toBe("Age");
    expect(ageGroup[0].segment.value).toBe("25-34");

    expect(incomeGroup).toHaveLength(1);
    expect(incomeGroup[0].rowGroup).toBe("Income");
    expect(incomeGroup[0].segment.value).toBe("High");
  });

  it("normalizes segment labels (strips Income suffix, removes spaces in Age)", async () => {
    const mockData = [
      createRow({ cohort_level: "Male" }),
      createRow({ cohort_level: "Female" }),
      createRow({ cohort_level: "LDA - 24" }),
      createRow({ cohort_level: "High Income" }),
      createRow({ cohort_level: "Medium Income" }),
      createRow({ cohort_level: "Low Income" }),
    ];

    const result: any = await evaluate(mockData);
    const ageGroup = result.rows[1];
    const incomeGroup = result.rows[2];

    expect(ageGroup[0].segment.value).toBe("LDA-24");
    expect(incomeGroup[0].segment.value).toBe("High");
    expect(incomeGroup[1].segment.value).toBe("Medium");
    expect(incomeGroup[2].segment.value).toBe("Low");
  });

  it("builds dynamic headers from first data row", async () => {
    const result: any = await evaluate([
      createRow({
        price_tier: "CORE CO",
        brand: "Brahma",
        competitor: "Amstel",
      }),
    ]);

    const header = result.header;

    expect(header[0]).toEqual({ id: "segment", title: "" });
    expect(header[1].id).toBe("beer");
    expect(header[1].title).toBe("Beer");
    expect(header[1].children).toHaveLength(1);
    expect(header[1].children[0].id).toBe("beer_volume");

    expect(header[2].id).toBe("coreco");
    expect(header[2].title).toBe("Core Co");
    expect(header[2].children[0].id).toBe("coreco_volume");
    expect(header[2].children[1].id).toBe("coreco_index");

    expect(header[3].id).toBe("brahma");
    expect(header[3].title).toBe("Brahma");
    expect(header[3].children[0].id).toBe("brahma_volume");

    expect(header[4].id).toBe("amstel");
    expect(header[4].title).toBe("Amstel");
    expect(header[4].children[0].id).toBe("amstel_volume");
  });

  it("maps source fields to correct column values with cellType", async () => {
    const result: any = await evaluate([
      createRow({
        cohort_level: "Male",
        category_ac: 59.2,
        category_index: 105,
        price_tier_ac: 60.2,
        price_tier_index: 102,
        brand_ac: 61.2,
        brand_index: 102,
        competitor_ac: 60.0,
        competitor_index: 100,
      }),
    ]);

    const row = result.rows[0][0];

    expect(row.beer_volume).toEqual({ value: 59.2, cellType: "barChart" });
    expect(row.beer_index).toBeUndefined();
    expect(row.coreco_volume).toEqual({ value: 60.2, cellType: "barChart" });
    expect(row.coreco_index).toEqual({ value: 102, cellType: "tag" });
    expect(row.brahma_volume).toEqual({ value: 61.2, cellType: "barChart" });
    expect(row.brahma_index).toEqual({ value: 102, cellType: "tag" });
    expect(row.amstel_volume).toEqual({ value: 60.0, cellType: "barChart" });
    expect(row.amstel_index).toEqual({ value: 100, cellType: "tag" });
  });
  it("sets rowGroupLabel only on the first row of each group", async () => {
    const mockData = [
      createRow({ cohort_level: "Male" }),
      createRow({ cohort_level: "Female" }),
      createRow({ cohort_level: "25-34" }),
      createRow({ cohort_level: "35-44" }),
    ];

    const result: any = await evaluate(mockData);

    expect(result.rows[0][0].rowGroupLabel).toBe("Gender");
    expect(result.rows[0][1].rowGroupLabel).toBeUndefined();
    expect(result.rows[1][0].rowGroupLabel).toBe("Age");
    expect(result.rows[1][1].rowGroupLabel).toBeUndefined();
  });

  it("returns empty state when datasource has no data", async () => {
    const result: any = await evaluate([]);

    expect(result).toEqual({ empty: true });
  });

  it("handles non-string dynamic fields without replace signature errors", async () => {
    const result: any = await evaluate([
      createRow({
        cohort_level: "Male",
        price_tier: 123,
        brand: null,
        competitor: { name: "Amstel" },
      }),
    ]);

    expect(result.header[2].id).toBe("123");
    expect(result.header[2].title).toBe("123");
    expect(result.header[2].tooltipContent).toBe(
      "Indicates whether this cohort is over- or under-represented in the brand's segment compared to the category baseline.",
    );
    expect(result.header[3].id).toBe("");
    expect(result.header[3].title).toBe("");
    expect(result.header[4].id).toBe("");
    expect(result.header[4].title).toBe("");
    expect(result.rows[0][0].segment.value).toBe("Male");
  });
});
