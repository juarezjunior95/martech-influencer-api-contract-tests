import { GetCountryMapCommand } from "../../../../../../../src/infrastructure/repositories/helpers/commands/resource-allocation-media/GetCountryMapCommand";

describe("GetCountryMapCommand", () => {
  const command = new GetCountryMapCommand();

  it("should keep the original resource-allocation-media mappings", () => {
    const result = command.execute();

    expect(result.USA).toBe("United States");
    expect(result.BRA).toBe("Brazil");
    expect(result.CHN).toBe("China");
    expect(result.MEX).toBe("Mexico");
    expect(result.CAN).toBe("Canada");
    expect(result.ARG).toBe("Argentina");
    expect(result.ZAF).toBe("South Africa");
    expect(result.COL).toBe("Colombia");
    expect(result.KOR).toBe("South Korea");
    expect(result.GBR).toBe("United Kingdom");
    expect(result.PER).toBe("Peru");
    expect(result.BEL).toBe("Belgium");
  });

  it("should include every full name observed in the production region chartLabel cURLs", () => {
    const result = command.execute();

    expect(result.BRA).toBe("Brazil");
    expect(result.USA).toBe("United States");
    expect(result.MEX).toBe("Mexico");
    expect(result.CHN).toBe("China");
    expect(result.ZAF).toBe("South Africa");
    expect(result.COL).toBe("Colombia");
    expect(result.ARG).toBe("Argentina");
    expect(result.PER).toBe("Peru");
    expect(result.HND).toBe("Honduras");
    expect(result.KOR).toBe("South Korea");
    expect(result.SLV).toBe("El Salvador");
    expect(result.GBR).toBe("United Kingdom");
  });

  it("should resolve the Drupal OTHER aggregate to 'Others'", () => {
    expect(command.execute().OTHER).toBe("Others");
  });

  it("should cover every ISO-3 code supported by the JWT claim", () => {
    const result = command.execute();
    const requiredIso3 = [
      "LSO",
      "ECU",
      "LUX",
      "SLV",
      "FRA",
      "SWZ",
      "DEU",
      "MEX",
      "MOZ",
      "HND",
      "NAM",
      "GHA",
      "ITA",
      "GTM",
      "JPN",
      "IND",
      "ARG",
      "IRL",
      "NLD",
      "NOR",
      "NGA",
      "BOL",
      "AUT",
      "BRA",
      "BEL",
      "PRY",
      "BWA",
      "PAN",
      "CHL",
      "CAN",
      "CHN",
      "PER",
      "DOM",
      "PRT",
      "ESP",
      "COL",
      "SWE",
      "DNK",
      "UGA",
      "ZAF",
      "USA",
      "KOR",
      "CHE",
      "TZA",
      "VNM",
      "GBR",
      "URY",
      "ZMB",
    ];
    requiredIso3.forEach((iso) => {
      expect(typeof result[iso]).toBe("string");
      expect(result[iso].length).toBeGreaterThan(0);
    });
  });

  it("should return a new object on each call", () => {
    const first = command.execute();
    const second = command.execute();
    expect(first).not.toBe(second);
    expect(first).toEqual(second);
  });
});
