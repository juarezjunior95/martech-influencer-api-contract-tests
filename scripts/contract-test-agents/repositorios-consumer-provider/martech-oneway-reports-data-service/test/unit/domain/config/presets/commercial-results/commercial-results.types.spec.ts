import {
  filterRowsByActiveDrivers,
  normalizeCommercialResultsPresetConfig,
} from "@domain/config/presets/commercial-results/commercial-results.types";

describe("normalizeCommercialResultsPresetConfig", () => {
  it("maps camelCase keys from applyOverrides back to snake_case", () => {
    expect(
      normalizeCommercialResultsPresetConfig({
        nonAlcoholic: "Yes",
        growthLevers: "Superior Core",
        beerPriceSegment: "Premium",
        packType: "Dr",
      } as Parameters<typeof normalizeCommercialResultsPresetConfig>[0]),
    ).toEqual({
      nonAlcoholic: "Yes",
      growthLevers: "Superior Core",
      beerPriceSegment: "Premium",
      packType: "Dr",
      non_alcoholic: "Yes",
      growth_levers: "Superior Core",
      beer_price_segment: "Premium",
      pack_type: "Dr",
    });
  });

  it("prefers snake_case when both snake_case and camelCase are present", () => {
    expect(
      normalizeCommercialResultsPresetConfig({
        non_alcoholic: "No",
        nonAlcoholic: "Yes",
        growth_levers: "Lead Premium",
        growthLevers: "Superior Core",
        beer_price_segment: "Core",
        beerPriceSegment: "Premium",
        pack_type: "Can",
        packType: "Dr",
      } as Parameters<typeof normalizeCommercialResultsPresetConfig>[0]),
    ).toEqual({
      non_alcoholic: "No",
      nonAlcoholic: "Yes",
      growth_levers: "Lead Premium",
      growthLevers: "Superior Core",
      beer_price_segment: "Core",
      beerPriceSegment: "Premium",
      pack_type: "Can",
      packType: "Dr",
    });
  });

  it("restores comma-containing scalar filters split by the generic preset pipeline", () => {
    expect(
      normalizeCommercialResultsPresetConfig({
        channel: ["3rd Party (Distributors", "Wholesalers", '\"Socios\")'],
      } as unknown as Parameters<
        typeof normalizeCommercialResultsPresetConfig
      >[0]),
    ).toMatchObject({
      channel: '3rd Party (Distributors, Wholesalers, "Socios")',
    });
  });

  it("returns undefined when input is undefined", () => {
    expect(normalizeCommercialResultsPresetConfig(undefined)).toBeUndefined();
  });
});

describe("filterRowsByActiveDrivers", () => {
  const beerRow = {
    country_iso_code_3: "ZAF",
    zone: "AFR",
    region: "Cape",
    period: "YTD",
    brand: "Castle Lite",
    sub_brand: "Castle Lite",
    sku: "Castle Lite 330ml",
    channel: "On Trade",
    pack_type: "Bottle",
    category: "Beer",
    non_alc_beer: "No",
    growth_levers: "Lead Premium",
    beer_price_segment: "Premium",
    portfolio: "Megabrands",
  };

  const adjRow = {
    ...beerRow,
    brand: "Brutal Fruit",
    category: "Adj",
    non_alc_beer: "Yes",
    growth_levers: "Beyond Beer",
    beer_price_segment: "Value",
    portfolio: "Expansion",
  };

  it("filters rows by every V2 driver, including differently named raw columns", () => {
    const rows = [beerRow, adjRow];

    expect(
      filterRowsByActiveDrivers(rows, {
        category: "Adj",
        non_alcoholic: "Yes",
        growth_levers: "Beyond Beer",
        beer_price_segment: "Value",
        portfolios: "Expansion",
      }),
    ).toEqual([adjRow]);
  });

  it("can skip a V2 key when building that dimension's own options", () => {
    expect(
      filterRowsByActiveDrivers(
        [beerRow, adjRow],
        { category: "Adj", portfolios: "Expansion" },
        { skipKeys: ["category"] },
      ),
    ).toEqual([adjRow]);
  });

  it("matches scalar labels regardless of comma whitespace lost during query coercion", () => {
    const row = {
      ...beerRow,
      channel: 'Distributor,Wholesaler,"Socios"',
    };

    expect(
      filterRowsByActiveDrivers([row], {
        channel: 'Distributor, Wholesaler, "Socios"',
      }),
    ).toEqual([row]);
  });
});
