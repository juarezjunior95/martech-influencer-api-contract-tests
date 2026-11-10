import {
  getPosToolDrilldownTimeframeTuples,
  getPosToolTimeframeTuples,
} from "@domain/config/presets/category/pos-tool/pos-tool-timeframe.model";
import { KPI_GROUP_DATASET_ID } from "@domain/config/presets/kpi-group/kpi-group.types";
import { Dataset } from "@domain/entities/common/base-config.entity";

describe("getPosToolTimeframeTuples", () => {
  it("derives quarter from kpi-group pos refresh date, not volume", () => {
    const datasets: Dataset[] = [
      {
        id: KPI_GROUP_DATASET_ID,
        data: [
          { kpi_name: "pos", time_frame: "01-06-2026" },
          { kpi_name: "volume", time_frame: "01-09-2026" },
        ],
      },
    ];
    const values = getPosToolTimeframeTuples(
      { valueField: "value", order: ["R12M", "QTD"] },
      datasets,
    );

    expect(values[0].label).toBe("R12M Q2'26");
    expect(values[1].label).toBe("QTD Q2'26");

    const drilldownValues = getPosToolDrilldownTimeframeTuples(datasets);
    expect(drilldownValues[0].label).toBe("R12M Q2'26");
    expect(drilldownValues[1].label).toBe("QTD Q2'26");
    expect(drilldownValues.map((row) => row.value)).toEqual([
      "R12M",
      "Quarter",
    ]);
  });

  it("builds overview options with period codes as values and dynamic labels", () => {
    const values = getPosToolTimeframeTuples({
      valueField: "value",
      order: ["R12M", "QTD"],
    });

    expect(values).toEqual([
      {
        value: "R12M",
        label: expect.stringMatching(/^R12M Q\d'\d{2}$/),
        full: "Rolling 12 Months (R12M)",
      },
      {
        value: "QTD",
        label: expect.stringMatching(/^QTD Q\d'\d{2}$/),
        full: "Quarter (QTR)",
      },
    ]);
  });

  it("builds drilldown-ready options with period labels as values", () => {
    const values = getPosToolDrilldownTimeframeTuples();

    expect(values).toEqual([
      {
        value: "R12M",
        label: expect.stringMatching(/^R12M Q\d'\d{2}$/),
        full: "Rolling 12 Months (R12M)",
      },
      {
        value: "Quarter",
        label: expect.stringMatching(/^QTD Q\d'\d{2}$/),
        full: "Quarter (QTR)",
      },
    ]);
  });

  it("preserves POS_PERIODS order when order is omitted", () => {
    const values = getPosToolTimeframeTuples({ valueField: "value" });

    expect(values.map((row) => row.value)).toEqual(["QTD", "R12M"]);
  });
});
