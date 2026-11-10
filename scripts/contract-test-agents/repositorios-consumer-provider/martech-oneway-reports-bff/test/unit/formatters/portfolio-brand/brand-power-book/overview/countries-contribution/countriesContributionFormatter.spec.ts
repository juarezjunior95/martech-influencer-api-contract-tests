import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("countriesContributionFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/countries-contribution/countriesContributionFormatter.jsonata",
  );

  const DS_KEY = "countries_contribution_ds";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  const buildAbiRow = (overrides: Record<string, any> = {}) => ({
    country_iso_code_3: "ABI",
    dt_end: "2025-09-30T00:00:00.000Z",
    ly: 52.9,
    ac: 53.3,
    rank: null,
    country: { imageIcon: "abi-icon.png" },
    ...overrides,
  });

  const buildCountryRow = (overrides: Record<string, any> = {}) => ({
    country_iso_code_3: "BRA",
    dt_end: "2025-09-30T00:00:00.000Z",
    ac: 60.5,
    ac_vs_ly: 1.2,
    ac_vs_ly_pond: 0.3,
    nr_contribution: 15,
    variationDirectionVsLy: "up",
    rank: 1,
    country: { imageIcon: "bra-icon.png" },
    ...overrides,
  });

  it("should return empty flag when datasource is empty", async () => {
    const result = await evaluate([]);
    expect(result).toEqual({ empty: true });
  });

  it("should return empty flag when ABI row is missing", async () => {
    const result = await evaluate([
      buildCountryRow({ country_iso_code_3: "BRA" }),
    ]);
    expect(result).toEqual({ empty: true });
  });

  it("should build waterfall data as [LY, ...pondValues, AC]", async () => {
    const rows = [
      buildAbiRow({ ly: 52.9, ac: 53.3 }),
      buildCountryRow({
        country_iso_code_3: "BRA",
        ac_vs_ly_pond: 0.3,
        rank: 1,
      }),
      buildCountryRow({
        country_iso_code_3: "MEX",
        ac_vs_ly_pond: 0.1,
        rank: 2,
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.data).toEqual([52.9, 0.3, 0.1, 53.3]);
  });

  it("should build labels with quarter labels and country codes", async () => {
    const rows = [
      buildAbiRow(),
      buildCountryRow({ country_iso_code_3: "BRA", rank: 1 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.labels).toHaveLength(3);
    expect(result.labels[0].value).toMatch(/^Q\d'\d{2}$/);
    expect(result.labels[0].image).toBe("abi-icon.png");
    expect(result.labels[1].value).toBe("BRA");
    expect(result.labels[1].image).toBe("bra-icon.png");
    expect(result.labels[2].value).toMatch(/^Q\d'\d{2}$/);
    expect(result.labels[2].image).toBe("abi-icon.png");
  });

  it("should order countries by rank ascending", async () => {
    const rows = [
      buildAbiRow(),
      buildCountryRow({ country_iso_code_3: "MEX", rank: 3 }),
      buildCountryRow({ country_iso_code_3: "BRA", rank: 1 }),
      buildCountryRow({ country_iso_code_3: "ARG", rank: 2 }),
    ];

    const result: any = await evaluate(rows);
    const countryLabels = result.labels.slice(1, -1).map((l: any) => l.value);

    expect(countryLabels).toEqual(["BRA", "ARG", "MEX"]);
  });

  it("should build three variationCaptions blocks", async () => {
    const rows = [
      buildAbiRow(),
      buildCountryRow({
        ac: 60.5,
        ac_vs_ly: 1.2,
        nr_contribution: 15,
        rank: 1,
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.variationCaptions).toHaveLength(3);
    expect(result.variationCaptions[0].title).toBe("Absolute Power");
    expect(result.variationCaptions[1].title).toBe("Comparison vs LY");
    expect(result.variationCaptions[2].title).toBe("NR Contribution");
  });

  it("should pad variationCaptions data with empty bookends", async () => {
    const rows = [buildAbiRow(), buildCountryRow({ rank: 1 })];

    const result: any = await evaluate(rows);
    const absBlock = result.variationCaptions[0];

    expect(absBlock.data).toHaveLength(3);
    expect(absBlock.data[0].value).toBe("");
    expect(absBlock.data[2].value).toBe("");
  });

  it("should use vsLy color based on variation direction", async () => {
    const rows = [
      buildAbiRow(),
      buildCountryRow({ ac_vs_ly: 1.2, variationDirectionVsLy: "up", rank: 1 }),
      buildCountryRow({
        country_iso_code_3: "MEX",
        ac_vs_ly: -0.5,
        variationDirectionVsLy: "down",
        rank: 2,
      }),
    ];

    const result: any = await evaluate(rows);
    const compBlock = result.variationCaptions[1];

    expect(compBlock.data[1].color).toBe("#49764B");
    expect(compBlock.data[2].color).toBe("#A20A0A");
  });

  it("should use ac field for pondValue when ac_vs_ly_pond is not a number", async () => {
    const rows = [
      buildAbiRow({ ly: 50, ac: 51 }),
      buildCountryRow({ ac_vs_ly_pond: null, rank: 1 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.data[1]).toBe(0);
  });
});
