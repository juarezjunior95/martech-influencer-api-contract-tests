import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_VOLUME =
  "connections-and-creativity_resource-allocation-media_investment-breakdown_volume-kpi";
const DS_FY =
  "connections-and-creativity_resource-allocation-media_investment-breakdown_media-full-year-kpis";
const DS_YTD =
  "connections-and-creativity_resource-allocation-media_investment-breakdown_media-ytd-kpis";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/investment-breakdown/table.jsonata",
);

const BASE_BRAND_ICON =
  "https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2026-02/";
const ORIGINAL_BRAND_ICON =
  "https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-01/";

describe("investment-breakdown formatter", () => {
  let compiledExpression: jsonata.Expression;

  type VolumeRow = {
    segment: string;
    raw_brand: string;
    ac: number;
    ac_vs_ly?: number | null;
    variationDirectionVsLy?: string;
    refreshMonthLabel: string;
    rank?: number;
  };

  type FyYtdRow = {
    segment: string;
    raw_brand: string;
    kpi_name: string;
    kpi_variation: string;
    bu?: number | null;
    ac: number;
    ac_vs_bu?: number | null;
    refreshMonthLabel: string;
  };

  const createMockInput = (
    volumeRows: VolumeRow[] = [],
    fyRows: FyYtdRow[] = [],
    ytdRows: FyYtdRow[] = [],
  ) => ({
    datasources: {
      [DS_VOLUME]: volumeRows,
      [DS_FY]: fyRows,
      [DS_YTD]: ytdRows,
    },
  });

  const getDataRows = (result: any): any[] => {
    const rows = result?.investment_breakdown?.rows;
    if (!Array.isArray(rows) || rows.length < 2) return [];
    return rows.slice(1).flat();
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return investment_breakdown with header and map volume rows", async () => {
    const volumeRows: VolumeRow[] = [
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        ac: 1000,
        ac_vs_ly: 5.2,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Dec'25",
        rank: 1,
      },
      {
        segment: "Expansion",
        raw_brand: "Stella Artois",
        ac: 2000,
        ac_vs_ly: -1.5,
        variationDirectionVsLy: "down",
        refreshMonthLabel: "Mar'26",
        rank: 1,
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(volumeRows, [], []),
    );

    expect(result.investment_breakdown).toMatchObject({
      header: expect.any(Array),
      rows: expect.any(Array),
    });
    expect(result.investment_breakdown.header).toHaveLength(7);

    const dataRows = getDataRows(result);
    expect(dataRows.length).toBeGreaterThanOrEqual(2);
    const stella = dataRows.find(
      (r: any) => r.brands?.imageName === "Stella Artois",
    );
    expect(stella).toMatchObject({
      portfolio: { value: "Expansion" },
      volume_AC: { value: 2000 },
      volume_LY: { value: -1.5, variationDirection: "down" },
    });
    expect(dataRows.some((r: any) => r.brands?.imageName === "Brahma")).toBe(
      true,
    );
  });

  it("should derive per-section subtitles from volume and each kpi_variation", async () => {
    const volumeRows: VolumeRow[] = [
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        ac: 100,
        refreshMonthLabel: "Jan'26",
        rank: 1,
      },
    ];
    const ytdRows: FyYtdRow[] = [
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        kpi_name: "media",
        kpi_variation: "tt_mkt",
        ac: 10,
        refreshMonthLabel: "Feb'26",
      },
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        kpi_name: "media",
        kpi_variation: "non_working_money",
        ac: 20,
        refreshMonthLabel: "Mar'26",
      },
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        kpi_name: "media",
        kpi_variation: "media",
        ac: 30,
        refreshMonthLabel: "Apr'26",
      },
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        kpi_name: "media",
        kpi_variation: "sponsorship_activation",
        ac: 40,
        refreshMonthLabel: "May'26",
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(volumeRows, [], ytdRows),
    );
    const header = result.investment_breakdown.header;

    expect(header.find((h: any) => h.title === "Volume")).toMatchObject({
      subtitle: "Jan'26",
    });
    expect(
      header.find((h: any) => h.title === "Marketing Package"),
    ).toMatchObject({ subtitle: "Feb'26" });
    expect(header.find((h: any) => h.title === "NWM")).toMatchObject({
      subtitle: "Mar'26",
    });
    expect(header.find((h: any) => h.title === "Media")).toMatchObject({
      subtitle: "Apr'26",
    });
    expect(
      header.find((h: any) => h.title === "Sponsorship & Activation"),
    ).toMatchObject({ subtitle: "May'26" });
  });

  it("should format null bu and ac_vs_bu as -", async () => {
    const volumeRows: VolumeRow[] = [
      {
        segment: "Megabrands",
        raw_brand: "Skol",
        ac: 500,
        refreshMonthLabel: "Dec'25",
        rank: 1,
      },
    ];
    const ytdRows: FyYtdRow[] = [
      {
        segment: "Megabrands",
        raw_brand: "Skol",
        kpi_name: "media",
        kpi_variation: "tt_mkt",
        bu: null,
        ac: 500,
        ac_vs_bu: null,
        refreshMonthLabel: "Dec'25",
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(volumeRows, [], ytdRows),
    );
    const row = getDataRows(result).find(
      (r: any) => r.brands?.imageName === "Skol",
    );

    expect(row).toMatchObject({
      marketing_package_FY_BU: { value: "-" },
      marketing_package_YTD_BU: { value: "-" },
    });
  });

  it("should use raw brand name for Tail and Total Market brands (no image URL)", async () => {
    const volumeRows: VolumeRow[] = [
      {
        segment: "Tail",
        raw_brand: "Tail",
        ac: 0,
        refreshMonthLabel: "Dec'25",
        rank: 1,
      },
      {
        segment: "Total",
        raw_brand: "Total Market",
        ac: 0,
        refreshMonthLabel: "Dec'25",
        rank: 1,
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(volumeRows, [], []),
    );
    const dataRows = getDataRows(result);

    expect(
      dataRows.find((r: any) => r.brands?.imageName === "Tail"),
    ).toMatchObject({ brands: { value: "Tail" } });
    expect(
      dataRows.find((r: any) => r.brands?.imageName === "Total Market"),
    ).toMatchObject({ brands: { value: "Total Market" } });
  });

  it("should use original brand icon for Guaraná Antarctica and Original", async () => {
    const volumeRows: (VolumeRow & { brand?: { imageTable: string } })[] = [
      {
        segment: "Sustain",
        raw_brand: "Guaraná Antarctica",
        ac: 100,
        refreshMonthLabel: "Dec'25",
        rank: 1,
        brand: { imageTable: ORIGINAL_BRAND_ICON + "guarana.svg" },
      },
      {
        segment: "Megabrands",
        raw_brand: "Original",
        ac: 100,
        refreshMonthLabel: "Dec'25",
        rank: 2,
        brand: { imageTable: ORIGINAL_BRAND_ICON + "original.svg" },
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(volumeRows, [], []),
    );
    const dataRows = getDataRows(result);

    expect(
      dataRows.find((r: any) => r.brands?.imageName === "Guaraná Antarctica"),
    ).toMatchObject({
      brands: { value: ORIGINAL_BRAND_ICON + "guarana.svg" },
    });
    expect(
      dataRows.find((r: any) => r.brands?.imageName === "Original"),
    ).toMatchObject({
      brands: { value: ORIGINAL_BRAND_ICON + "original.svg" },
    });
  });

  it("should use base brand icon for known brands", async () => {
    const volumeRows: (VolumeRow & { brand?: { imageTable: string } })[] = [
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        ac: 100,
        refreshMonthLabel: "Dec'25",
        rank: 1,
        brand: { imageTable: BASE_BRAND_ICON + "brahma.svg" },
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(volumeRows, [], []),
    );
    const row = getDataRows(result).find(
      (r: any) => r.brands?.imageName === "Brahma",
    );

    expect(row?.brands?.value).toMatch(
      new RegExp(
        `^${BASE_BRAND_ICON.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*brahma.*\\.svg$`,
      ),
    );
  });

  it("should return empty state when datasources are empty or missing", async () => {
    const emptyResult = await compiledExpression.evaluate(
      createMockInput([], [], []),
    );
    expect(emptyResult.investment_breakdown).toMatchObject({
      empty: true,
    });

    const missingResult = await compiledExpression.evaluate({
      datasources: {},
    });
    expect(missingResult.investment_breakdown).toMatchObject({
      empty: true,
    });
  });

  it("should group rows by segment (Megabrands, Expansion, Sustain, Tail, Total)", async () => {
    const volumeRows: VolumeRow[] = [
      {
        segment: "Total",
        raw_brand: "Total Market",
        ac: 1,
        refreshMonthLabel: "Dec'25",
        rank: 1,
      },
      {
        segment: "Megabrands",
        raw_brand: "Brahma",
        ac: 2,
        refreshMonthLabel: "Dec'25",
        rank: 1,
      },
      {
        segment: "Tail",
        raw_brand: "Tail",
        ac: 3,
        refreshMonthLabel: "Dec'25",
        rank: 1,
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(volumeRows, [], []),
    );
    const rows = result.investment_breakdown.rows;

    expect(rows.length).toBeGreaterThanOrEqual(2);
    const segmentValues = rows.slice(1).map((group: any) => {
      const firstCell = Array.isArray(group) ? group[0] : group;
      return firstCell?.portfolio?.value;
    });
    expect(segmentValues.filter(Boolean)).toEqual([
      "Megabrands",
      "Tail",
      "Total",
    ]);
  });
});
