import { runOverviewFormatterSuite } from "./helpers";

runOverviewFormatterSuite({
  describeName: "Portfolio Brand Brand Analysis Brand Power formatter",
  formatterFile: "brand-power.jsonata",
  kpiName: "power",
  unitOfMeasure: "pp",
  bigNumber: {
    title: "Brand Power",
    measure: "[%]",
    expectedDirection: "down",
    expectedVersus: "vs Q4'24 YTD",
    expectedTotal: -1.3,
  },
  yearFull: {
    expectedComparison: 9.9,
    sendsTooltip: true,
  },
  monthQuarter: {
    type: "bar",
    labelsType: "quarters",
    expectedBackgroundColorLength: 2,
  },
  expectedRefreshDate: { month: "Dec'25", quarter: "Q4'25" },
  rendersDashOnNullComparison: false,
});
