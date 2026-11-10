import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
import {
  mapKpiSlug,
  pickField,
  sortByBarOrder,
  toCanonicalPeriodLabel,
  toNumber,
  VALID_CONTRIBUTION_KPIS,
} from "./contribution-performance.utils";

/**
 * Innovation Hub - Performance & Breakdown - Contribution waterfall handler.
 * Maps lake innovation-contribution rows to the snake_case contract consumed by the BFF formatter.
 */
class ContributionHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset?.data?.length) {
      return [];
    }

    const sortedRows = sortByBarOrder(defaultDataset.data);
    const firstKpi = mapKpiSlug(
      pickField(
        sortedRows[0] as Record<string, unknown>,
        "kpi",
        "kpi_name",
        "KPI_NAME",
      ),
    );

    if (!firstKpi || !VALID_CONTRIBUTION_KPIS.has(firstKpi)) {
      return [];
    }

    return sortedRows.map((item, index) => {
      const record = item as Record<string, unknown>;
      const periodLabel = toCanonicalPeriodLabel(record, index);
      const contribution = toNumber(
        pickField(
          record,
          "contribution",
          "CONTRIBUTION",
          "contribution_pct",
          "CONTRIBUTION_PCT",
        ),
      );
      const contributionDirection =
        contribution !== undefined
          ? formatDirection(contribution, { positiveZero: true })
          : undefined;

      return {
        bar_order: toNumber(pickField(record, "bar_order", "BAR_ORDER")),
        period_label: periodLabel,
        bar_type: pickField(
          record,
          "bar_type",
          "BAR_TYPE",
          "label",
          "LABEL",
        ) as string | undefined,
        metric_value: toNumber(
          pickField(record, "metric_value", "METRIC_VALUE", "value", "VALUE"),
        ),
        contribution,
        contribution_direction: contributionDirection,
        kpi: mapKpiSlug(pickField(record, "kpi", "kpi_name", "KPI_NAME")),
        country: pickField(
          record,
          "country",
          "COUNTRY",
          "country_iso_code_3",
          "COUNTRY_ISO_CODE_3",
        ) as string | undefined,
        dt_end: pickField(record, "dt_end", "DT_END") as string | undefined,
        unit_of_measure: pickField(
          record,
          "unit_of_measure",
          "UNIT_OF_MEASURE",
        ) as string | undefined,
        comp_unit_of_measure: pickField(
          record,
          "comp_unit_of_measure",
          "COMP_UNIT_OF_MEASURE",
        ) as string | undefined,
      };
    });
  }
}

export const contributionHandler = new ContributionHandler();
