import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league overview league-champions formatter", () => {
  const mockInput = {
    datasources: {
      "value-creation_growth-league_overview_league-champions": [
        {
          country_iso_code_3: "USA",
          league: "Super League",
          ranking: 1,
          score: 95.5,
          country: { imageWaving: "https://example.com/flags/usa.png" },
        },
        {
          country_iso_code_3: "BRA",
          league: "Super League",
          ranking: 2,
          score: 88.3,
          country: { imageWaving: "https://example.com/flags/bra.png" },
        },
        {
          country_iso_code_3: "MEX",
          league: "Premier League",
          ranking: 1,
          score: 92.1,
          country: { imageWaving: "https://example.com/flags/mex.png" },
        },
        {
          country_iso_code_3: "COL",
          league: "Premier League",
          ranking: 2,
          score: 85.8,
          country: { imageWaving: "https://example.com/flags/col.png" },
        },
      ],
    },
  };

  let result: any;

  beforeAll(async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/overview/league-champions.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
    result = await compiledExpression.evaluate(mockInput);
  });

  it("should output a leagueChampions array", () => {
    expect(result).toHaveProperty("leagueChampions");
    expect(Array.isArray(result.leagueChampions)).toBe(true);
    expect(result.leagueChampions.length).toBe(2);
  });

  it("should not include legacy datasources or config keys", () => {
    expect(result).not.toHaveProperty("datasources");
    expect(result).not.toHaveProperty("config");
  });

  it("should include label and rank in each league group", () => {
    const superLeague = result.leagueChampions[0];
    expect(superLeague.label).toBe("super-league");
    expect(Array.isArray(superLeague.rank)).toBe(true);
    expect(superLeague.rank.length).toBe(2);

    const premierLeague = result.leagueChampions[1];
    expect(premierLeague.label).toBe("premier-league");
    expect(Array.isArray(premierLeague.rank)).toBe(true);
    expect(premierLeague.rank.length).toBe(2);
  });

  it("should map league champions data correctly", () => {
    const firstItem = result.leagueChampions[0].rank[0];
    expect(firstItem.countryName).toBe("USA");
    expect(firstItem.position).toBe("1");
    expect(firstItem.value).toBe(95.5);
    expect(firstItem.flag).toBe("https://example.com/flags/usa.png");
    expect(firstItem.measure).toBe("%");
  });

  it("should convert position to string", () => {
    result.leagueChampions.forEach((group: any) => {
      [].concat(group.rank).forEach((item: any) => {
        expect(typeof item.position).toBe("string");
      });
    });
  });

  it("should include all required fields in each rank item", () => {
    const requiredFields = [
      "countryName",
      "position",
      "value",
      "flag",
      "measure",
    ];

    result.leagueChampions.forEach((group: any) => {
      [].concat(group.rank).forEach((item: any) => {
        requiredFields.forEach((field) => {
          expect(item).toHaveProperty(field);
        });
      });
    });
  });
});
