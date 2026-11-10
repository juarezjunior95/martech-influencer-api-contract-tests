import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league overview rank formatter", () => {
  const mockInput = {
    datasources: {
      "value-creation_growth-league_overview_rank": [
        {
          country_iso_code_3: "USA",
          ranking: 1,
          score: 95.5,
          country: { imageIcon: "https://example.com/flags/usa.png" },
          league: "Super League",
        },
        {
          country_iso_code_3: "BRA",
          ranking: 2,
          score: 88.3,
          country: { imageIcon: "https://example.com/flags/bra.png" },
          league: "Super League",
        },
        {
          country_iso_code_3: "MEX",
          ranking: 3,
          score: 82.1,
          country: { imageIcon: "https://example.com/flags/mex.png" },
          league: "Premier League",
        },
        {
          country_iso_code_3: "COL",
          ranking: 4,
          score: 79.8,
          country: { imageIcon: "https://example.com/flags/col.png" },
          league: "Premier League",
        },
      ],
    },
  };

  let result: any;

  beforeAll(async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/overview/rank.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
    result = await compiledExpression.evaluate(mockInput);
  });

  it("should output a ranking object grouped by league", () => {
    expect(result).toHaveProperty("ranking");
    expect(typeof result.ranking).toBe("object");
    expect(result.ranking).toHaveProperty("super-league");
    expect(result.ranking).toHaveProperty("premier-league");
  });

  it("should not include legacy datasources or config keys", () => {
    expect(result).not.toHaveProperty("datasources");
    expect(result).not.toHaveProperty("config");
  });

  it("should include label and rank in each league group", () => {
    const superLeague = result.ranking["super-league"];
    expect(superLeague.label).toBe("Super League");
    expect(Array.isArray(superLeague.rank)).toBe(true);
    expect(superLeague.rank.length).toBe(2);

    const premierLeague = result.ranking["premier-league"];
    expect(premierLeague.label).toBe("Premier League");
    expect(Array.isArray(premierLeague.rank)).toBe(true);
    expect(premierLeague.rank.length).toBe(2);
  });

  it("should map rank data correctly", () => {
    const firstItem = result.ranking["super-league"].rank[0];
    expect(firstItem.countryName).toBe("USA");
    expect(firstItem.position).toBe("1");
    expect(firstItem.value).toBe(95.5);
    expect(firstItem.flag).toBe("https://example.com/flags/usa.png");
    expect(firstItem.measure).toBe("%");
    expect(firstItem.league).toBe("Super League");
  });

  it("should convert position to string", () => {
    const allRanks = [
      ...result.ranking["super-league"].rank,
      ...result.ranking["premier-league"].rank,
    ];
    allRanks.forEach((item: { position: string }) => {
      expect(typeof item.position).toBe("string");
    });
  });

  it("should include all required fields in each rank item", () => {
    const requiredFields = [
      "countryName",
      "position",
      "value",
      "flag",
      "measure",
      "league",
    ];

    Object.values(result.ranking).forEach((group: any) => {
      [].concat(group.rank).forEach((item: any) => {
        requiredFields.forEach((field) => {
          expect(item).toHaveProperty(field);
        });
      });
    });
  });
});
