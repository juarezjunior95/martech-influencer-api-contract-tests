import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league overview cup-winners formatter", () => {
  const mockInput = {
    datasources: {
      "value-creation_growth-league_overview_cup-winners": [
        {
          raw_geography: "USA",
          version_id: 1001,
          division: "tier_1",
          cup_name: "dtc_cup",
          ranking: 1,
          ac: 95.5,
          country: { imageWaving: "https://example.com/flags/usa.png" },
        },
        {
          raw_geography: "BRA",
          version_id: 1001,
          division: "tier_1",
          cup_name: "dtc_cup",
          ranking: 2,
          ac: 88.3,
          country: { imageWaving: "https://example.com/flags/bra.png" },
        },
        {
          raw_geography: "MEX",
          version_id: 1001,
          division: "maturity_index",
          cup_name: "bees_cup",
          ranking: 1,
          ac: 92.1,
          country: { imageWaving: "https://example.com/flags/mex.png" },
        },
        {
          raw_geography: "COL",
          version_id: 1001,
          division: "maturity_index",
          cup_name: "bees_cup",
          ranking: 2,
          ac: 79.8,
          country: { imageWaving: "https://example.com/flags/col.png" },
        },
        {
          raw_geography: "ARG",
          version_id: 1001,
          division: "country",
          cup_name: "mega_brands_cup",
          ranking: 1,
          ac: 85.0,
          country: { imageWaving: "https://example.com/flags/arg.png" },
        },
        {
          raw_geography: "ECU",
          version_id: 1001,
          division: "country",
          cup_name: "mega_brands_cup",
          ranking: 2,
          ac: 78.0,
          country: { imageWaving: "https://example.com/flags/ecu.png" },
        },
        {
          raw_geography: "BOL",
          version_id: 1001,
          division: "Huari",
          cup_name: "mega_brands_cup",
          ranking: 1,
          ac: 90.0,
          country: { imageWaving: "https://example.com/flags/bol.png" },
        },
        {
          raw_geography: "PAN",
          version_id: 1001,
          division: "Aguila",
          cup_name: "mega_brands_cup",
          ranking: 2,
          ac: 87.0,
          country: { imageWaving: "https://example.com/flags/pan.png" },
        },
        {
          raw_geography: "PER",
          version_id: 1001,
          division: "league_a",
          cup_name: "ka_cup",
          ranking: 1,
          ac: 80.0,
          country: { imageWaving: "https://example.com/flags/per.png" },
        },
        {
          raw_geography: "CHL",
          version_id: 1001,
          division: "league_a",
          cup_name: "ka_cup",
          ranking: 2,
          ac: 76.0,
          country: { imageWaving: "https://example.com/flags/chl.png" },
        },
        {
          raw_geography: "CHL",
          version_id: 1001,
          division: "health_index",
          cup_name: "bees_cup",
          ranking: 1,
          ac: 77.0,
          country: { imageWaving: "https://example.com/flags/chl.png" },
        },
        {
          raw_geography: "URY",
          version_id: 1001,
          division: "health_index",
          cup_name: "bees_cup",
          ranking: 2,
          ac: 74.0,
          country: { imageWaving: "https://example.com/flags/ury.png" },
        },
        {
          raw_geography: "ZAF",
          version_id: 1001,
          division: "N/A",
          cup_name: "channel_cup",
          ranking: 1,
          ac: 70.0,
          country: { imageWaving: "https://example.com/flags/zaf.png" },
        },
        {
          raw_geography: "NGA",
          version_id: 1001,
          division: "N/A",
          cup_name: "channel_cup",
          ranking: 2,
          ac: 68.0,
          country: { imageWaving: "https://example.com/flags/nga.png" },
        },
      ],
    },
  };

  let result: any;

  beforeAll(async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/overview/cup-winners.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
    result = await compiledExpression.evaluate(mockInput);
  });

  it("should output a cupWinners object", () => {
    expect(result).toHaveProperty("cupWinners");
    expect(typeof result.cupWinners).toBe("object");
    expect(Array.isArray(result.cupWinners)).toBe(false);
  });

  it("should not include datasources or config keys", () => {
    expect(result).not.toHaveProperty("datasources");
    expect(result).not.toHaveProperty("config");
  });

  it("should derive keys using the translating config", () => {
    expect(result.cupWinners).toHaveProperty("dtc_cup_tier1");
    expect(result.cupWinners).toHaveProperty("bees_cup_maturity");
    expect(result.cupWinners).toHaveProperty("bees_cup_index");
    expect(result.cupWinners).toHaveProperty("mega_brands_cup_country");
    expect(result.cupWinners).toHaveProperty("ka_cup_league_a");
  });

  it("should use cup_name as key when no translating match", () => {
    expect(result.cupWinners).toHaveProperty("mega_brands_cup");
    expect(result.cupWinners).toHaveProperty("channel_cup");
  });

  it("should set the label to the cup_name", () => {
    expect(result.cupWinners.dtc_cup_tier1.label).toBe("dtc_cup");
    expect(result.cupWinners.bees_cup_maturity.label).toBe("bees_cup");
    expect(result.cupWinners.mega_brands_cup_country.label).toBe(
      "mega_brands_cup",
    );
    expect(result.cupWinners.channel_cup.label).toBe("channel_cup");
  });

  it("should include correct rank items within each group", () => {
    const tier1 = result.cupWinners.dtc_cup_tier1;
    const tier1Rank = [].concat(tier1.rank);
    expect(tier1Rank.length).toBe(2);
    expect(tier1Rank[0].countryName).toBe("USA");
    expect(tier1Rank[1].countryName).toBe("BRA");
  });

  it("should map rank fields correctly", () => {
    const firstRank = [].concat(result.cupWinners.dtc_cup_tier1.rank)[0];
    expect(firstRank.countryName).toBe("USA");
    expect(firstRank.position).toBe("1");
    expect(firstRank.flag).toBe("https://example.com/flags/usa.png");
  });

  it("should convert position to string", () => {
    Object.values(result.cupWinners).forEach((group: any) => {
      [].concat(group.rank).forEach((item: any) => {
        expect(typeof item.position).toBe("string");
      });
    });
  });

  it("should include brand field for mega_brands_cup brand division", () => {
    const megaBrandRanks = [].concat(result.cupWinners.mega_brands_cup.rank);
    expect(megaBrandRanks[0].brand).toBe("Huari");
    expect(megaBrandRanks[0].countryName).toBe("BOL");
  });

  it("should not include brand field for mega_brands_cup country division", () => {
    const megaCountryRanks = [].concat(
      result.cupWinners.mega_brands_cup_country.rank,
    );
    expect(megaCountryRanks[0]).not.toHaveProperty("brand");
    expect(megaCountryRanks[0].countryName).toBe("ARG");
  });

  it("should not include brand field for non-mega_brands_cup groups", () => {
    const dtcTier1Ranks = [].concat(result.cupWinners.dtc_cup_tier1.rank);
    dtcTier1Ranks.forEach((item: any) => {
      expect(item).not.toHaveProperty("brand");
    });
  });

  it("should include all required fields in each rank item", () => {
    const requiredFields = ["countryName", "position", "flag"];

    Object.values(result.cupWinners).forEach((group: any) => {
      [].concat(group.rank).forEach((item: any) => {
        requiredFields.forEach((field) => {
          expect(item).toHaveProperty(field);
        });
      });
    });
  });
});
