import {
  timeFrameHandler,
  TimeFramePresetValue,
} from "@domain/config/presets/time-frame/time-frame.handler";
import { KPI_GROUP_DATASET_ID } from "@domain/config/presets/kpi-group/kpi-group.types";
import { Dataset } from "@domain/entities/common/base-config.entity";

describe("timeFrameHandler", () => {
  it("maps volume DD-MM-YYYY to FilterValuesDto-shaped ini/end (Drupal TimeFrame volume)", () => {
    const result = timeFrameHandler.handle({
      "time-frame": { volumeRefreshDate: "01-03-2026" },
    });
    const tf = result["time-frame"] as TimeFramePresetValue;

    expect(tf).toEqual({
      values: { ini: "2025-01-01", end: "2026-03-01" },
      default: { ini: "2026-01-01", end: "2026-03-01" },
      enabled: true,
    });
  });

  it("floors the range start year at 2023 (PHP max(ytd-1, 2023))", () => {
    const result = timeFrameHandler.handle({
      "time-frame": { volumeRefreshDate: "01-03-2024" },
    });
    const tf = result["time-frame"] as TimeFramePresetValue;

    expect(tf).toEqual({
      values: { ini: "2023-01-01", end: "2024-03-01" },
      default: { ini: "2024-01-01", end: "2024-03-01" },
      enabled: true,
    });
  });

  it("reads volume time_frame from kpi-group dataset when preset omits override", () => {
    const datasets: Dataset[] = [
      {
        id: KPI_GROUP_DATASET_ID,
        data: [{ kpi_name: "volume", time_frame: "01-03-2026" }],
      },
    ];
    const result = timeFrameHandler.handle({}, datasets);
    const tf = result["time-frame"] as TimeFramePresetValue;

    expect(tf).toEqual({
      values: { ini: "2025-01-01", end: "2026-03-01" },
      default: { ini: "2026-01-01", end: "2026-03-01" },
      enabled: true,
    });
  });

  it("throws when the string is not three DD-MM-YYYY segments", () => {
    expect(() =>
      timeFrameHandler.handle({
        "time-frame": { volumeRefreshDate: "01-02" },
      }),
    ).toThrow(/Expected DD-MM-YYYY/);
  });

  it("throws when segments do not form a valid calendar date", () => {
    expect(() =>
      timeFrameHandler.handle({
        "time-frame": { volumeRefreshDate: "not-a-date" },
      }),
    ).toThrow(/Invalid volume date/);
  });
});
