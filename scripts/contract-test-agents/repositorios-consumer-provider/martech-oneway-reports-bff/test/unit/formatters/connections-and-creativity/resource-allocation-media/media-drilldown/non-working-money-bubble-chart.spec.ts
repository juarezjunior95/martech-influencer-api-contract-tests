import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DS_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_non-working-money-bubble-chart";
const GUIDELINE_KEY =
  "connections-and-creativity_resource-allocation-media_media-drilldown_non-working-money-guideline";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/connections-and-creativity/resource-allocation-media/media-drilldown/non-working-money-bubble-chart.jsonata",
);

describe("non-working-money-bubble-chart formatter", () => {
  let compiledExpression: jsonata.Expression;

  type MainRow = {
    country_iso_code_3: string;
    segment: string;
    raw_brand: string;
    global_brand: string;
    ac: number;
  };

  type GuidelineRow = {
    country_iso_code_3: string;
    ac: number;
    segment?: string;
  };

  const createMockInput = (
    mainRows: MainRow[] = [],
    guidelineRows: GuidelineRow[] = [],
  ) => ({
    datasources: {
      [DS_KEY]: mainRows,
      [GUIDELINE_KEY]: guidelineRows,
    },
  });

  const unwrap = (result: Record<string, unknown>) =>
    result?.non_working_money as {
      Chart?: {
        datasets?: Array<{ bubbles?: unknown[] }>;
        backgroundChart?: { backgrounds?: unknown[] };
        [key: string]: unknown;
      };
      Legend?: unknown[];
    };

  const getAllBubbles = (result: Record<string, unknown>) => {
    const datasets = unwrap(result)?.Chart?.datasets;
    if (!Array.isArray(datasets)) return [];
    return datasets.flatMap((d) => (Array.isArray(d.bubbles) ? d.bubbles : []));
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should build chart structure, legend, axis, caption and backgrounds when datasources have data", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Corona Extra",
        global_brand: "Corona",
        ac: 15.5,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Brahma",
        global_brand: "Brahma",
        ac: 10,
      },
    ];
    const guidelineRows: GuidelineRow[] = [
      { country_iso_code_3: "BRA", ac: 20, segment: "Megabrands" },
    ];

    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, guidelineRows),
    );

    const data = unwrap(result);
    expect(data).toMatchObject({
      Chart: {
        yAxis: { min: -3, max: 110 },
        label: expect.anything(),
        caption: { title: "NWM Guideline adherence [%]" },
      },
      Legend: [
        { label: "Global Brands", pointStyle: "rectRot" },
        { label: "Brands", pointStyle: "circle" },
      ],
    });
    expect(Array.isArray(data.Chart.datasets)).toBe(true);
    expect(data.Chart.backgroundChart.backgrounds).toHaveLength(3);
  });

  it("should set bubble colors by ac zones and boundaries", async () => {
    const mainRows: MainRow[] = [
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "G8",
        global_brand: "G8",
        ac: 8,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "G14",
        global_brand: "G14",
        ac: 14,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Megabrands",
        raw_brand: "Y15a",
        global_brand: "Y15a",
        ac: 15,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Y17",
        global_brand: "Y17",
        ac: 17,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Sustain",
        raw_brand: "Y20",
        global_brand: "Y20",
        ac: 20,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "R21",
        global_brand: "R21",
        ac: 21,
      },
      {
        country_iso_code_3: "BRA",
        segment: "Expansion",
        raw_brand: "R25",
        global_brand: "R25",
        ac: 25,
      },
    ];
    const result = await compiledExpression.evaluate(
      createMockInput(mainRows, []),
    );

    const bubbles = getAllBubbles(result) as Array<{
      y: number;
      backgroundColor: string;
      hoverBackgroundColor: string;
    }>;
    const byY = (y: number) => bubbles.find((b) => b.y === y);

    expect(byY(8)).toMatchObject({
      hoverBackgroundColor: "#1B5606",
      backgroundColor: "#1B560680",
    });
    expect(byY(14)).toMatchObject({ hoverBackgroundColor: "#1B5606" });
    expect(byY(15)).toMatchObject({ hoverBackgroundColor: "#1B5606" });
    expect(byY(17)).toMatchObject({
      hoverBackgroundColor: "#E5B611",
      backgroundColor: "#E5B6118F",
    });
    expect(byY(20)).toMatchObject({ hoverBackgroundColor: "#863939" });
    expect(byY(21)).toMatchObject({ hoverBackgroundColor: "#863939" });
    expect(byY(25)).toMatchObject({
      hoverBackgroundColor: "#863939",
      backgroundColor: "#86393980",
    });
  });

  it("should return empty chart and legend when main datasource is empty or datasources are missing", async () => {
    const emptyMain = await compiledExpression.evaluate(
      createMockInput([], []),
    );
    const missingDs = await compiledExpression.evaluate({ datasources: {} });

    expect(unwrap(emptyMain)).toMatchObject({ Chart: {}, Legend: [] });
    expect(unwrap(missingDs)).toMatchObject({ Chart: {}, Legend: [] });
  });
});
