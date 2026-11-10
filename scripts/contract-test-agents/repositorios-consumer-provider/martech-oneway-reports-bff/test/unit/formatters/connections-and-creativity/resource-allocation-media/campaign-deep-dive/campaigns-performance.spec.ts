import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

const DS_TABLE =
  "connections-and-creativity_resource-allocation-media_campaign-deep-dive_campaign-tracker-by-brand-table";
const DS_WEEKLY =
  "connections-and-creativity_resource-allocation-media_campaign-deep-dive_campaign-tracker-by-brand-weekly-calendar";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/campaign-deep-dive/campaigns-performance.jsonata",
);

describe("campaigns-performance formatter", () => {
  let compiledExpression: jsonata.Expression;

  type TrackerRow = {
    country_iso_code_3?: string;
    segment?: string;
    raw_brand: string;
    campaign: string;
    kpi_name?: string;
    kpi_variation: string;
    ac: number;
  };

  type WeeklyRow = {
    raw_brand: string;
    campaign: string;
    week?: number;
    week_number?: number;
    week_type?: string;
  };

  const createMockInput = (
    trackerRows: TrackerRow[] = [],
    weeklyRows: WeeklyRow[] = [],
  ) => ({
    datasources: {
      [DS_TABLE]: trackerRows,
      [DS_WEEKLY]: weeklyRows,
    },
  });

  const createMockInputWithComponents = (
    trackerRows: TrackerRow[] = [],
    weeklyRows: WeeklyRow[] = [],
  ) => ({
    view: "connections-and-creativity_resource-allocation-media_campaign-deep-dive_campaigns-performance",
    components: [
      {
        id: "campaigns_performance",
        data: {
          datasources: {
            [DS_TABLE]: trackerRows,
            [DS_WEEKLY]: weeklyRows,
          },
        },
      },
    ],
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return campaigns_performance with header and rows when tracker has data", async () => {
    const baseBrandIcon =
      "https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2026-02/";
    const rows: (TrackerRow & { brand?: { imageTable: string } })[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "TT QWOA",
        kpi_name: "media",
        kpi_variation: "campaign_qwoa_total",
        ac: 29,
        brand: { imageTable: baseBrandIcon + "brahma.svg" },
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        kpi_name: "media",
        kpi_variation: "campaign_qwoa",
        ac: 10,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        kpi_name: "media",
        kpi_variation: "campaign_woa",
        ac: 52,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        kpi_name: "media",
        kpi_variation: "campaign_spend",
        ac: 6500000,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const brandRow = result.campaigns_performance.rows[0][0];

    expect(result.campaigns_performance).toMatchObject({
      header: expect.any(Array),
      rows: [[expect.anything()]],
    });
    expect(result.campaigns_performance.header).toHaveLength(7);
    expect(result.campaigns_performance.header[0]).toMatchObject({
      title: "Brand",
      id: "brand",
    });
    expect(result.campaigns_performance.header[6]).toMatchObject({
      id: "gantt",
      params: { type: "gantt" },
    });

    expect(brandRow).toMatchObject({
      brand: expect.objectContaining({
        value: "Brahma",
        portfolio: "megabrands",
      }),
      campaign: {
        cellType: "text",
        value: [{ value: "Brahma Zero" }],
      },
      tt_qwoa: { value: [{ id: "tt_qwoa", value: 29 }] },
      campaign_woa: { value: [{ value: "52" }] },
      campaign_qwoa: { value: [{ value: "10" }] },
      campaign_$: { value: [{ value: "$6.50" }] },
      gantt: {
        cellType: "gantt",
        mode: "milestones",
        ganttData: [
          expect.objectContaining({
            cells: expect.arrayContaining([
              expect.objectContaining({ id: "week-1" }),
            ]),
          }),
        ],
      },
    });
    expect(brandRow.brand.src).toContain("brahma");
    expect(brandRow.gantt.ganttData[0].cells).toHaveLength(52);
  });

  it("should exclude TT QWOA from campaign list", async () => {
    const rows: TrackerRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "TT QWOA",
        kpi_name: "media",
        kpi_variation: "campaign_qwoa_total",
        ac: 29,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        kpi_name: "media",
        kpi_variation: "campaign_qwoa",
        ac: 10,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Chopp Brahma",
        kpi_name: "media",
        kpi_variation: "campaign_qwoa",
        ac: 6,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));
    const campaignNames =
      result.campaigns_performance.rows[0][0].campaign.value.map(
        (c: { value: string }) => c.value,
      );

    expect(campaignNames).toEqual(
      expect.arrayContaining(["Brahma Zero", "Chopp Brahma"]),
    );
    expect(campaignNames).not.toContain("TT QWOA");
  });

  it("should return empty rows when datasource has no campaign rows", async () => {
    const rows: TrackerRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "TT QWOA",
        kpi_name: "media",
        kpi_variation: "campaign_qwoa_total",
        ac: 29,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.campaigns_performance).toMatchObject({ rows: [[]] });
  });

  it("should accept input via components[0].data.datasources", async () => {
    const rows: TrackerRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Skol Pilsen",
        campaign: "Férias & Feriados",
        kpi_name: "media",
        kpi_variation: "campaign_qwoa",
        ac: 45,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Skol Pilsen",
        campaign: "TT QWOA",
        kpi_variation: "campaign_qwoa_total",
        ac: 40,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Skol Pilsen",
        campaign: "Férias & Feriados",
        kpi_variation: "campaign_woa",
        ac: 50,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Skol Pilsen",
        campaign: "Férias & Feriados",
        kpi_variation: "campaign_spend",
        ac: 1000000,
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInputWithComponents(rows),
    );
    const brandRow = result.campaigns_performance.rows[0][0];

    expect(brandRow).toMatchObject({
      brand: { value: "Skol Pilsen", portfolio: "sustain" },
      campaign_qwoa: { value: [{ value: "45" }] },
      campaign_$: { value: [{ value: "$1.00" }] },
    });
  });

  it("should set portfolio from segment lowercase", async () => {
    const rows: TrackerRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "Budweiser",
        campaign: "FWC26",
        kpi_variation: "campaign_qwoa_total",
        ac: 16,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "Budweiser",
        campaign: "FWC26",
        kpi_variation: "campaign_qwoa",
        ac: 16,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "Budweiser",
        campaign: "FWC26",
        kpi_variation: "campaign_woa",
        ac: 20,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "Budweiser",
        campaign: "FWC26",
        kpi_variation: "campaign_spend",
        ac: 0,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.campaigns_performance.rows[0][0].brand).toMatchObject({
      portfolio: "expansion",
    });
  });

  it("should use first country when multiple countries present", async () => {
    const rows: TrackerRow[] = [
      {
        country_iso_code_3: "USA",
        segment: "Megabrands",
        raw_brand: "Budweiser",
        campaign: "C1",
        kpi_variation: "campaign_qwoa_total",
        ac: 5,
      },
      {
        country_iso_code_3: "USA",
        segment: "Megabrands",
        raw_brand: "Budweiser",
        campaign: "C1",
        kpi_variation: "campaign_qwoa",
        ac: 5,
      },
      {
        country_iso_code_3: "USA",
        segment: "Megabrands",
        raw_brand: "Budweiser",
        campaign: "C1",
        kpi_variation: "campaign_woa",
        ac: 10,
      },
      {
        country_iso_code_3: "USA",
        segment: "Megabrands",
        raw_brand: "Budweiser",
        campaign: "C1",
        kpi_variation: "campaign_spend",
        ac: 1000000,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "C2",
        kpi_variation: "campaign_qwoa",
        ac: 10,
      },
    ];

    const result = await compiledExpression.evaluate(createMockInput(rows));

    expect(result.campaigns_performance.rows[0]).toHaveLength(1);
    expect(result.campaigns_performance.rows[0][0].brand).toMatchObject({
      value: "Budweiser",
    });
  });

  it("should build gantt cells with timing and milestone from weekly data", async () => {
    const trackerRows: TrackerRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "TT QWOA",
        kpi_variation: "campaign_qwoa_total",
        ac: 29,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        kpi_variation: "campaign_qwoa",
        ac: 10,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        kpi_variation: "campaign_woa",
        ac: 52,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        kpi_variation: "campaign_spend",
        ac: 1000000,
      },
    ];
    const weeklyRows: WeeklyRow[] = [
      {
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        week_number: 2,
        week_type: "woa",
      },
      {
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        week_number: 3,
        week_type: "qwoa",
      },
      {
        raw_brand: "Brahma",
        campaign: "Brahma Zero",
        week_number: 4,
        week_type: "woa",
      },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(trackerRows, weeklyRows),
    );
    const ganttRow = result.campaigns_performance.rows[0][0].gantt.ganttData[0];

    expect(ganttRow).toMatchObject({
      cells: expect.arrayContaining([
        expect.objectContaining({ id: "week-1" }),
      ]),
      style: { height: "36px" },
      mode: "milestones",
      tooltip: [
        { value: 2, label: "Starting Week" },
        { value: 4, label: "Ending Week" },
      ],
    });
    expect(ganttRow.cells).toHaveLength(52);

    const week1 = ganttRow.cells.find((c: { id: string }) => c.id === "week-1");
    expect(week1).toMatchObject({ timing: null, milestone: null });
    expect(week1).not.toHaveProperty("color");

    const week2 = ganttRow.cells.find((c: { id: string }) => c.id === "week-2");
    expect(week2).toMatchObject({ timing: "start", color: "#F7EFBBA3" });
    expect(week2).not.toHaveProperty("milestone");

    const week3 = ganttRow.cells.find((c: { id: string }) => c.id === "week-3");
    expect(week3).toMatchObject({ timing: null });
    expect(week3.milestone).toEqual(
      expect.objectContaining({ color: expect.anything() }),
    );

    const week4 = ganttRow.cells.find((c: { id: string }) => c.id === "week-4");
    expect(week4).toMatchObject({ timing: "end", color: "#F7EFBBA3" });
    expect(week4).not.toHaveProperty("milestone");
  });
});
