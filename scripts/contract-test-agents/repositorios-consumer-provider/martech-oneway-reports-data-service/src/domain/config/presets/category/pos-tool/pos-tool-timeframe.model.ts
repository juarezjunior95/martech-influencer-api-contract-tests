import { Dataset } from "@domain/entities/common/base-config.entity";
import {
  POS_PERIODS,
  PosPeriodPresetValue,
  PosPeriodTuple,
} from "@domain/config/presets/pos-periods/pos-periods.handler";
import kpiGroupTimeFrame from "@domain/config/config-groups/kpi-group-time-frame.config";
import { kpiGroupHandler } from "@domain/config/presets/kpi-group/kpi-group.handler";
import {
  timeFrameHandler,
  TimeFramePresetValue,
} from "@domain/config/presets/time-frame/time-frame.handler";
import { POS_TOOL_TIMEFRAME_FULL_LABELS } from "@domain/config/presets/category/pos-tool/pos-tool-timeframe.constants";

export interface PosToolTimeframeConfig {
  valueField: "value" | "label";
  order?: Array<"QTD" | "R12M">;
}

function resolvePosRefreshDate(datasets?: Dataset[]): string {
  const queried = kpiGroupHandler.handle({}, datasets);
  const fromQuery =
    typeof queried.pos === "string" && queried.pos.length > 0
      ? queried.pos
      : "";
  return fromQuery || kpiGroupTimeFrame.config.pos;
}

function resolveTimeFrameEndDate(datasets?: Dataset[]): Date {
  const posRefreshDate = resolvePosRefreshDate(datasets);
  const response = timeFrameHandler.handle(
    { "time-frame": { volumeRefreshDate: posRefreshDate } },
    datasets,
  );
  const block = response["time-frame"] as TimeFramePresetValue | undefined;
  const rawEnd = block?.default?.end ?? block?.values?.end;

  if (typeof rawEnd !== "string") {
    return new Date();
  }

  const parsed = new Date(`${rawEnd}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function resolveCurrentQuarter(datasets?: Dataset[]): string {
  const endDate = resolveTimeFrameEndDate(datasets);
  const month = endDate.getUTCMonth() + 1;
  const quarter = Math.ceil(month / 3);
  return `Q${quarter}`;
}

function resolveCurrentYearTwoDigits(datasets?: Dataset[]): string {
  const endDate = resolveTimeFrameEndDate(datasets);
  const year = endDate.getUTCFullYear();
  return String(year).slice(-2);
}

export function getPosToolTimeframeTuples(
  config: PosToolTimeframeConfig,
  datasets?: Dataset[],
): PosPeriodTuple[] {
  const quarter = resolveCurrentQuarter(datasets);
  const yy = resolveCurrentYearTwoDigits(datasets);

  const options = POS_PERIODS.map((period) => ({
    value: config.valueField === "value" ? period.value : period.label,
    label: `${period.value} ${quarter}'${yy}`,
    full: POS_TOOL_TIMEFRAME_FULL_LABELS[period.value] ?? period.label,
  }));

  if (!config.order) {
    return options;
  }

  return config.order
    .map((code) =>
      options.find((option) => {
        const period = POS_PERIODS.find((row) => row.value === code);
        if (!period) {
          return false;
        }
        const optionValue =
          config.valueField === "value" ? period.value : period.label;
        return option.value === optionValue;
      }),
    )
    .filter((option): option is PosPeriodTuple => option !== undefined);
}

export function getPosToolOverviewPeriods(
  datasets?: Dataset[],
): PosPeriodPresetValue {
  const values = getPosToolTimeframeTuples(
    { valueField: "value", order: ["R12M", "QTD"] },
    datasets,
  );

  const defaultRow =
    values.find((row) => row.value === "R12M") ??
    values[0] ??
    ({ value: "", label: "", full: "" } as const);

  return {
    enabled: true,
    values,
    default: { ...defaultRow },
  };
}

export function getPosToolDrilldownTimeframeTuples(
  datasets?: Dataset[],
): PosPeriodTuple[] {
  return getPosToolTimeframeTuples(
    { valueField: "label", order: ["R12M", "QTD"] },
    datasets,
  );
}
