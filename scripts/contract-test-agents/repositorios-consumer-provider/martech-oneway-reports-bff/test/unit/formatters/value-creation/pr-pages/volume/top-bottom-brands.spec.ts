import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("top-bottom-brands formatter", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/top-bottom-brands.jsonata",
  );

  type DatasourceEntry = {
    dt_end: string;
    rnk: number;
    country_iso_code_3: string;
    raw_brand: string;
    segment: string;
    ac: number;
    ac_vs_ly: number | null;
    delta: number;
    kpi: "volume" | "volume_weight";
    period_type: "MTD" | "YTD";
    variationDirectionVsLy: "up" | "down";
    brand: {
      imageSquare: string;
    };
    country: {
      imageIcon: string;
    };
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    dt_end: "2026-02-01",
    rnk: 1,
    country_iso_code_3: "USA",
    raw_brand: "Budweiser",
    segment: "Megabrands",
    ac: 120.4,
    ac_vs_ly: -2.1,
    delta: -72.5,
    kpi: "volume",
    period_type: "MTD",
    variationDirectionVsLy: "down",
    brand: {
      imageSquare: "https://example.com/brand-budweiser.png",
    },
    country: {
      imageIcon: "https://example.com/country-usa.png",
    },
    ...overrides,
  });

  const createVolumeEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      kpi: "volume",
      ...overrides,
    });

  const createVolumeWeightEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      kpi: "volume_weight",
      ac: 2.3,
      ac_vs_ly: null,
      delta: 0,
      ...overrides,
    });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      "top-bottom-brands": entries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  const getAvatars = (result: any): any[] => {
    const avatarData = result?.brandsAvatar?.data;
    if (!avatarData) {
      return [];
    }
    if (Array.isArray(avatarData)) {
      return avatarData;
    }
    if (typeof avatarData === "object") {
      return [avatarData];
    }
    return Array.from(avatarData);
  };

  const getAvatarByTitle = (result: any, title: string) =>
    getAvatars(result).find((item: any) => item.title === title);

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return empty object when datasource is empty", async () => {
    const mockInput = createMockInput([]);
    const result = await evaluateExpression(mockInput);

    expect(result).toEqual({ empty: true });
  });

  it("should keep badgeFlag for regular brands", async () => {
    const entries = [
      createVolumeEntry({
        raw_brand: "Budweiser",
        country_iso_code_3: "USA",
        segment: "Megabrands",
      }),
      createVolumeWeightEntry({
        raw_brand: "Budweiser",
        country_iso_code_3: "USA",
        segment: "Megabrands",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const budweiserAvatar = getAvatarByTitle(result, "Budweiser");

    expect(budweiserAvatar).toBeDefined();
    expect(budweiserAvatar.description).toBe("USA");
    expect(budweiserAvatar.badgeFlag).toBeDefined();
    expect(budweiserAvatar.badgeFlag.src).toBe(
      "https://example.com/country-usa.png",
    );
    expect(budweiserAvatar.badgeFlag.alt).toBe("USA FLAG");
  });

  it("should not include badgeFlag for Others when country is GLOBAL", async () => {
    const entries = [
      createVolumeEntry({
        raw_brand: "Others",
        country_iso_code_3: "GLOBAL",
        segment: "Megabrands",
        brand: {
          imageSquare: "https://example.com/brand-others.png",
        },
        country: {
          imageIcon: "https://example.com/country-global.png",
        },
      }),
      createVolumeWeightEntry({
        raw_brand: "Others",
        country_iso_code_3: "GLOBAL",
        segment: "Megabrands",
        brand: {
          imageSquare: "https://example.com/brand-others.png",
        },
        country: {
          imageIcon: "https://example.com/country-global.png",
        },
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const othersAvatar = getAvatarByTitle(result, "Others");

    expect(othersAvatar).toBeDefined();
    expect(othersAvatar.mainBrand.src).toBe(
      "https://example.com/brand-others.png",
    );
    expect(othersAvatar.badgeFlag).toBeUndefined();
    expect(othersAvatar.description).toBe("Others");
  });

  it("should not include badgeFlag for aggregate variants using case-insensitive matching", async () => {
    const entries = [
      createVolumeEntry({
        rnk: 1,
        raw_brand: "OTHERS",
        country_iso_code_3: "USA",
        segment: "Megabrands",
      }),
      createVolumeEntry({
        rnk: 2,
        raw_brand: "others",
        country_iso_code_3: "MEX",
        segment: "Megabrands",
      }),
      createVolumeEntry({
        rnk: 3,
        raw_brand: "Brand Others",
        country_iso_code_3: "BRA",
        segment: "Megabrands",
      }),
      createVolumeEntry({
        rnk: 4,
        raw_brand: "GLOBAL",
        country_iso_code_3: "USA",
        segment: "Megabrands",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const aggregateTitles = ["OTHERS", "others", "Brand Others", "GLOBAL"];

    aggregateTitles.forEach((title) => {
      const avatar = getAvatarByTitle(result, title);
      expect(avatar).toBeDefined();
      expect(avatar.badgeFlag).toBeUndefined();
      expect(avatar.description).toBe(title);
    });
  });
});
