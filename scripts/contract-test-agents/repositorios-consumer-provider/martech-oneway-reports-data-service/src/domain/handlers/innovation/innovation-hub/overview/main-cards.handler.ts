import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";

const KNOWN_COMPARATORS = new Set(["ac", "vs bu", "vs ly", "country", "zone"]);

const pickField = (item: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }

    const upperKey = key.toUpperCase();
    if (item[upperKey] !== undefined && item[upperKey] !== null) {
      return item[upperKey];
    }
  }

  return undefined;
};

const normalizeComparators = (value: unknown): string => {
  const normalized = String(value ?? "").trim();
  const lower = normalized.toLowerCase();

  if (KNOWN_COMPARATORS.has(lower)) {
    return lower;
  }

  return normalized.toUpperCase();
};

const buildBarLabels = (dtEnd: unknown): string[] => {
  if (!dtEnd) {
    return [];
  }

  const date = new Date(String(dtEnd));

  if (isNaN(date.getTime())) {
    return [];
  }

  const year = date.getUTCFullYear();
  const shortYear = String(year).slice(-2);
  const previousYear = String(year - 1).slice(-2);
  const twoYearsPrior = String(year - 2).slice(-2);

  return [
    `'${twoYearsPrior}`,
    `'${previousYear}`,
    `'${shortYear} BU`,
    `'${shortYear} LE`,
  ];
};

const variationDirection = (value: unknown): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    return undefined;
  }

  return formatDirection(numericValue);
};

/**
 * Innovation Hub - Overview - Main Cards Handler
 * Maps lake global-total-innovation-performance rows to the snake_case contract
 * consumed by the BFF formatter.
 */
class MainCardsHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset?.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const record = item as Record<string, unknown>;
      const dtEnd = pickField(record, ["dt_end", "DT_END"]);
      const barLabels = buildBarLabels(dtEnd);
      const last2 = pickField(record, ["last_2", "LAST_2"]);
      const last1 = pickField(record, ["last_1", "LAST_1"]);
      const periodBu = pickField(record, ["bu", "BU"]);
      const periodLe = pickField(record, ["le", "LE"]);
      const current = pickField(record, ["current", "CURRENT"]);

      return {
        kpi_name: pickField(record, ["kpi_name", "KPI_NAME"]) as string,
        comparators: normalizeComparators(
          pickField(record, ["comparators", "COMPARATORS"]),
        ),
        dt_ini: pickField(record, ["dt_ini", "DT_INI"]) as string,
        dt_end: dtEnd as string,
        period_type: pickField(record, [
          "period_type",
          "PERIOD_TYPE",
        ]) as string,
        label_period: pickField(record, [
          "label_period",
          "LABEL_PERIOD",
        ]) as string,
        unit_of_measure: pickField(record, [
          "unit_of_measure",
          "UNIT_OF_MEASURE",
        ]) as string,
        last_2: last2 as number,
        last_1: last1 as number,
        bu: periodBu as number,
        le: periodLe as number,
        current: current as number,
        bar_labels: barLabels.length > 0 ? barLabels : undefined,
        variationDirectionLast2: variationDirection(last2),
        variationDirectionLast1: variationDirection(last1),
        variationDirectionBu: variationDirection(periodBu),
        variationDirectionLe: variationDirection(periodLe),
        variationDirectionCurrent: variationDirection(current),
      };
    });
  }
}

export const mainCardsHandler = new MainCardsHandler();
