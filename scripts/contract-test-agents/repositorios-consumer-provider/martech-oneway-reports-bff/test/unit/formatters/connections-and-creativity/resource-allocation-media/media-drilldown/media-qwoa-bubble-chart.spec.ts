import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_media-qwoa-bubble-chart";
const COMPARISON_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_megabrands-over-45-qwoa-brands-over-guideline";
const CAMPAIGN_DS_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_campaign-qwoa-bubble-chart";
const CAMPAIGN_COMPARISON_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_campaigns-under-12-qwoa-campaign-qwoa-per-brand";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/media-drilldown/media-qwoa-bubble-chart.jsonata",
);

describe("media-qwoa-bubble-chart formatter", () => {
  let compiledExpression: jsonata.Expression;

  type MainRow = {
    country_iso_code_3: string;
    segment: string;
    raw_brand: string;
    ac: number;
  };

  type ComparisonRow = {
    country_iso_code_3: string;
    ac: number;
    segment?: string;
  };

  const createMockInput = (
    mainRows: MainRow[] = [],
    comparisonRows: ComparisonRow[] = [],
  ) => ({
    datasources: {
      [DS_KEY]: mainRows,
      [COMPARISON_KEY]: comparisonRows,
    },
  });

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should build full Chart structure with guideline caption data", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        ac: 51,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Skol",
        ac: 51,
      },
    ];
    const comparisonRows: ComparisonRow[] = [
      { country_iso_code_3: "BRA", ac: 60, segment: "Megabrands" },
      { country_iso_code_3: "BRA", ac: 20, segment: "Sustain" },
    ];
    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, comparisonRows),
    );

    const chart = result.media_qwoa.Chart;
    expect(chart.yAxis).toEqual({ min: -3, max: 70 });
    expect(chart.info).toEqual({ label: "Eixos" });
    expect(chart.backgroundChart.backgrounds).toHaveLength(3);
    expect(chart.backgroundChart.backgrounds[0]).toMatchObject({
      from: -3,
      to: 35,
      color: "#DAB1B152",
    });
    expect(chart.backgroundChart.backgrounds[1]).toMatchObject({
      from: 35,
      to: 45,
      color: "#E4E1A052",
    });
    expect(chart.backgroundChart.backgrounds[2]).toMatchObject({
      from: 45,
      to: 70,
      color: "#BCDAB452",
    });
    expect(chart.label).toHaveLength(2);
    expect(chart.label[0]).toMatchObject({
      text: "Megabrands",
      portfolioColor: "#E5B611",
    });
    expect(chart.label[1].text).toBe("Sustain");
    expect(chart.caption.title).toBe("Brands over 45 QWOA [%]");
    expect(chart.caption.data).toHaveLength(2);
    expect(chart.caption.data[0].value).toBe(60);
    expect(chart.caption.data[1].value).toBe(20);
    expect(chart.datasets).toHaveLength(2);
  });

  it("should group by segment, order datasets, and apply color threshold at 45", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        ac: 51,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Corona",
        ac: 30,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "Stella Artois",
        ac: 41,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Skol",
        ac: 52,
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, []),
    );

    const chart = result.media_qwoa.Chart;

    expect(chart.datasets[0].bubbles).toHaveLength(2);
    expect(chart.datasets[0].bubbles[0]).toMatchObject({
      y: 51,
      r: 9,
      tooltip: "Brahma: 51",
      backgroundColor: "#1B560680",
      hoverBackgroundColor: "#1B5606",
    });
    expect(chart.datasets[0].bubbles[1]).toMatchObject({
      y: 30,
      tooltip: "Corona: 30",
      backgroundColor: "#86393980",
      hoverBackgroundColor: "#863939",
    });

    expect(chart.datasets[1].bubbles).toHaveLength(1);
    expect(chart.datasets[1].bubbles[0]).toMatchObject({
      y: 41,
      tooltip: "Stella Artois: 41",
    });

    expect(chart.datasets[2].bubbles).toHaveLength(1);
    expect(chart.datasets[2].bubbles[0]).toMatchObject({
      y: 52,
      tooltip: "Skol: 52",
    });
  });

  it("should use only the first country in dataset", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "USA",
        segment: "Megabrands",
        raw_brand: "Bud",
        ac: 40,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        ac: 51,
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, []),
    );

    expect(result.media_qwoa.Chart.datasets[0].bubbles).toHaveLength(1);
    expect(result.media_qwoa.Chart.datasets[0].bubbles[0].tooltip).toBe(
      "Bud: 40",
    );
  });

  it("should return empty true when datasource is empty or missing", async () => {
    const resultEmpty = await compiledExpression.evaluate(
      createMockInput([], []),
    );
    expect(resultEmpty.media_qwoa).toEqual({ empty: true });

    const resultMissing = await compiledExpression.evaluate({
      datasources: {},
    });
    expect(resultMissing.media_qwoa).toEqual({ empty: true });
  });

  describe("campaign_qwoa path (using campaign-qwoa-bubble-chart formatter)", () => {
    let campaignExpression: jsonata.Expression;

    const CAMPAIGN_JSONATA_PATH = path.join(
      process.cwd(),
      "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/media-drilldown/campaign-qwoa-bubble-chart.jsonata",
    );

    type CampaignRow = {
      country_iso_code_3: string;
      segment: string;
      raw_brand: string;
      brand_campaign: string;
      ac: number;
    };

    const createCampaignMockInput = (rows: CampaignRow[] = []) => ({
      datasources: {
        [CAMPAIGN_DS_KEY]: rows,
        [CAMPAIGN_COMPARISON_KEY]: [] as {
          country_iso_code_3: string;
          raw_brand: string;
          ac: number;
        }[],
      },
    });

    beforeAll(() => {
      const expression = fs.readFileSync(CAMPAIGN_JSONATA_PATH, "utf8");
      campaignExpression = jsonata(expression);
      registerHelpers(campaignExpression);
    });

    it("should build campaign_qwoa with labels, datasets, threshold 12 backgrounds and Legend", async () => {
      const rows: CampaignRow[] = [
        {
          country_iso_code_3: "BRA",
          segment: "Megabrands",
          raw_brand: "Corona Extra",
          brand_campaign: "Naturals",
          ac: 4,
        },
        {
          country_iso_code_3: "BRA",
          segment: "Megabrands",
          raw_brand: "Budweiser",
          brand_campaign: "Bud Tour",
          ac: 0,
        },
      ];
      const result = await campaignExpression.evaluate(
        createCampaignMockInput(rows),
      );

      const chart = result.campaign_qwoa.Chart;
      expect(chart.label).toHaveLength(2);
      expect(chart.label[0].text).toBe("Corona Extra");
      expect(chart.label[1].text).toBe("Budweiser");
      expect(chart.datasets).toHaveLength(2);
      expect(chart.datasets[0].bubbles[0]).toMatchObject({
        y: 4,
        ac: 4,
        tooltip: "Naturals: 4",
      });
      expect(chart.datasets[1].bubbles[0]).toMatchObject({
        y: 0,
        ac: 0,
        tooltip: "Bud Tour: 0",
      });
      expect(chart.backgroundChart.backgrounds[0]).toMatchObject({
        from: -3,
        to: 12,
        color: "#DAB1B152",
      });
      expect(chart.backgroundChart.backgrounds[1]).toMatchObject({
        from: 12,
        to: 70,
        color: "#BCDAB452",
      });
      expect(chart.caption.title).toBe("Campaigns QWOA per Brand ");
      expect(chart.caption.subtitle).toBe("vs Guideline");
      expect(result.campaign_qwoa.Legend).toHaveLength(4);
    });
  });
});
