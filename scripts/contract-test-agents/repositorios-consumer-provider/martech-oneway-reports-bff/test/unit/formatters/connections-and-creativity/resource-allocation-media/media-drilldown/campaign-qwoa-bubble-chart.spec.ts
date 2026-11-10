import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_campaign-qwoa-bubble-chart";
const COMPARISON_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_campaigns-under-12-qwoa-campaign-qwoa-per-brand";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/media-drilldown/campaign-qwoa-bubble-chart.jsonata",
);

describe("campaign-qwoa-bubble-chart formatter", () => {
  let compiledExpression: jsonata.Expression;

  type MainRow = {
    country_iso_code_3: string;
    segment: string;
    raw_brand: string;
    brand_campaign: string;
    ac: number;
    brand?: { imageSquare: string };
    country?: { imageIcon: string };
  };

  type ComparisonRow = {
    country_iso_code_3: string;
    raw_brand: string;
    segment?: string;
    ac: number;
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

  it("should build full Chart structure and Legend from main + comparison data", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Corona Extra",
        brand_campaign: "Campaign A",
        ac: 15.5,
      },
    ];
    const comparisonRows: ComparisonRow[] = [
      { country_iso_code_3: "BRA", raw_brand: "Corona Extra", ac: 10.2 },
    ];
    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, comparisonRows),
    );

    const chart = result.campaign_qwoa.Chart;
    expect(chart.yAxis).toEqual({ min: -3, max: 70 });
    expect(chart.info).toEqual({ label: "Eixos" });
    expect(chart.backgroundChart.backgrounds).toHaveLength(2);
    expect(chart.label[0]).toMatchObject({
      text: "Corona Extra",
      portfolioColor: "#E5B611",
    });
    expect(chart.caption.title).toBe("Campaigns QWOA per Brand ");
    expect(chart.caption.subtitle).toBe("vs Guideline");
    expect(chart.caption.data[0]).toMatchObject({
      value: "10.2",
      unit_of_measure: "%",
      color: "#1414148F",
    });
    expect(chart.datasets[0].bubbles[0]).toMatchObject({
      y: 15.5,
      r: 9,
      tooltip: "Campaign A: 15.5",
    });
    expect(result.campaign_qwoa.Legend).toEqual([
      {
        color: "#E5B611",
        pointStyle: "roundedRectangle",
        label: "Megabrands",
        border: "#14141420",
      },
      {
        color: "#C2346A",
        pointStyle: "roundedRectangle",
        label: "Expansion",
        border: "#14141420",
      },
      {
        color: "#2F74AA",
        pointStyle: "roundedRectangle",
        label: "Sustain",
        border: "#14141420",
      },
      {
        color: "#4E579F",
        pointStyle: "roundedRectangle",
        label: "Tail",
        border: "#14141420",
      },
    ]);
  });

  it("should map bubble with brandIcon, countryFlag and colors", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Budweiser",
        brand_campaign: "Bud Tour",
        ac: 4,
        brand: { imageSquare: "https://cdn.example.com/budweiser.svg" },
        country: { imageIcon: "https://cdn.example.com/BRA.png" },
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, []),
    );

    const bubble = result.campaign_qwoa.Chart.datasets[0].bubbles[0];
    expect(bubble.brandIcon).toBe("https://cdn.example.com/budweiser.svg");
    expect(bubble.countryFlag).toBe("https://cdn.example.com/BRA.png");
    expect(bubble.backgroundColor).toBe("#86393980");
    expect(bubble.hoverBackgroundColor).toBe("#863939");
    expect(bubble.ac).toBe(4);
  });

  it("should return empty Chart when datasource is empty or missing", async () => {
    const resultEmpty = await compiledExpression.evaluate(
      createMockInput([], []),
    );
    expect(resultEmpty.campaign_qwoa.Chart).toEqual({});

    const resultMissing = await compiledExpression.evaluate({
      datasources: {},
    });
    expect(resultMissing.campaign_qwoa.Chart).toEqual({});
  });

  it("should accept input via components[0].data.datasources", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Skol Pilsen",
        brand_campaign: "Férias & Feriados",
        ac: 4,
      },
    ];
    const mockInput = {
      components: [
        {
          id: "campaign_qwoa",
          data: {
            datasources: {
              [DS_KEY]: mainRows,
              [COMPARISON_KEY]: [],
            },
          },
        },
      ],
    };
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.campaign_qwoa.Chart.label[0].text).toBe("Skol Pilsen");
    expect(result.campaign_qwoa.Chart.datasets[0].bubbles[0].tooltip).toBe(
      "Férias & Feriados: 4",
    );
  });

  it("should order brands by segment priority and assign correct colors", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Tail",
        raw_brand: "Brand Tail",
        brand_campaign: "C1",
        ac: 1,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brand Mega",
        brand_campaign: "C2",
        ac: 2,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "Brand Exp",
        brand_campaign: "C3",
        ac: 3,
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, []),
    );

    const labels = result.campaign_qwoa.Chart.label;
    expect(labels).toHaveLength(3);
    expect(labels[0]).toMatchObject({
      text: "Brand Mega",
      portfolioColor: "#E5B611",
    });
    expect(labels[1]).toMatchObject({
      text: "Brand Exp",
      portfolioColor: "#C2346A",
    });
    expect(labels[2]).toMatchObject({
      text: "Brand Tail",
      portfolioColor: "#4E579F",
    });

    const datasets = result.campaign_qwoa.Chart.datasets;
    expect(datasets[0].bubbles[0].y).toBe(2);
    expect(datasets[1].bubbles[0].y).toBe(3);
    expect(datasets[2].bubbles[0].y).toBe(1);
  });
});
