import { formatDirection } from "@common/utils/direction.utils";
import { formatMonth } from "@common/utils/month.utils";
import { formatPeriod } from "@common/utils/period.utils";
import { DataItem, Dataset } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

const METRIC_FIELDS = [
  "volume_growth_contr",
  "volume_weight",
  "volume_ac_vs_ly",
  "nr_ac_vs_ly",
  "cores_ac_vs_ly",
  "brand_power_pp",
  "sm_of_maco_ac",
  "sm_weight",
  "volume_ac",
  "sm_of_maco_ac_vs_ly",
  "market_share",
] as const;

function getField(item: DataItem, key: string) {
  const lowercaseKey = key.toLowerCase();

  if (Object.prototype.hasOwnProperty.call(item, key)) {
    return item[key];
  }

  return item[lowercaseKey];
}

function getDirection(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "";
  }

  return formatDirection(numericValue);
}

function getMonthRefresh(dtEnd: string): string {
  return formatMonth(dtEnd, {
    includeYear: true,
    yearFormat: "short",
  });
}

function getPeriodRefresh(dtEnd: string): string {
  return formatPeriod(dtEnd, dtEnd, {
    alwaysUseQuarter: true,
    includeYear: true,
    yearFormat: "short",
  });
}

/**
 * Value Creation - Overview - Portfolio Performance Handler
 * Handles the wide Portfolio Performance SQL output, where each row is a segment
 * and each KPI is exposed as a dedicated metric column.
 */
class PortfolioPerformanceHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const dtEndVolume = getField(item, "DT_END_VOLUME") as string;
      const dtEndOthers = getField(item, "DT_END_OTHERS") as string;
      const dtEndPower =
        (getField(item, "DT_END_POWER") as string) || dtEndOthers;

      const result: DataItem = {
        segment: getField(item, "SEGMENT"),
        dt_end_volume: dtEndVolume,
        dt_end_others: dtEndOthers,
        dt_end_power: dtEndPower,
        volume_period_refresh: getPeriodRefresh(dtEndVolume),
        volume_month_refresh: getMonthRefresh(dtEndVolume),
        others_period_refresh: getPeriodRefresh(dtEndOthers),
        others_month_refresh: getMonthRefresh(dtEndOthers),
        power_period_refresh: getPeriodRefresh(dtEndPower),
      };

      METRIC_FIELDS.forEach((field) => {
        const fieldKey = field.toUpperCase();
        const value = getField(item, fieldKey);

        result[field] = value;
        result[`comp_${field}_direction`] = getDirection(value);
      });

      return result;
    });
  }
}

export const portfolioPerformanceHandler = new PortfolioPerformanceHandler();
