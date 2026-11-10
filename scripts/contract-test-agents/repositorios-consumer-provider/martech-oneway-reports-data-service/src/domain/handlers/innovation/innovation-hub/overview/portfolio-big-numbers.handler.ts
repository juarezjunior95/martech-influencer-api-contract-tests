import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

const normalizeGeo = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value);
  return normalized === "ALL" ? "ABI" : normalized;
};

const pickField = (item: DataItem, ...keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }

  return undefined;
};

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numericValue = Number(value);

  return Number.isNaN(numericValue) ? undefined : numericValue;
};

/**
 * Innovation Hub - Overview - Portfolio Big Numbers Handler
 * Maps lake TVF columns (KPI, VALUE, VS_LY, PERIOD) to the BFF formatter contract.
 */
class PortfolioBigNumbersHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset?.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const ac = toNumber(
        pickField(item, "value", "VALUE", "ac", "AC", "current", "CURRENT"),
      );
      const acVsLy = toNumber(
        pickField(item, "vs_ly", "VS_LY", "ac_vs_ly", "AC_VS_LY"),
      );
      const variationDirectionVsLy =
        pickField(
          item,
          "variationDirectionVsLy",
          "VARIATION_DIRECTION_VS_LY",
          "variation_direction_vs_ly",
        ) ?? (acVsLy !== undefined ? formatDirection(acVsLy) : undefined);

      return {
        kpi_name: pickField(item, "kpi", "KPI", "kpi_name", "KPI_NAME") as
          | string
          | undefined,
        ac,
        ac_vs_ly: acVsLy,
        variationDirectionVsLy: variationDirectionVsLy as string | undefined,
        refreshMonthLabel: pickField(
          item,
          "refreshMonthLabel",
          "REFRESH_MONTH_LABEL",
          "refresh_month_label",
        ) as string | undefined,
        label_period: pickField(item, "label_period", "LABEL_PERIOD") as
          | string
          | undefined,
        period_type: pickField(
          item,
          "period",
          "PERIOD",
          "period_type",
          "PERIOD_TYPE",
        ) as string | undefined,
        unit_of_measure: pickField(
          item,
          "unit_of_measure",
          "UNIT_OF_MEASURE",
        ) as string | undefined,
        comp_unit_of_measure: pickField(
          item,
          "comp_unit_of_measure",
          "COMP_UNIT_OF_MEASURE",
        ) as string | undefined,
        country: normalizeGeo(
          pickField(
            item,
            "country_iso_code_3",
            "COUNTRY_ISO_CODE_3",
            "country",
            "COUNTRY",
          ),
        ),
        zone: normalizeGeo(
          pickField(item, "abi_zone", "ABI_ZONE", "zone", "ZONE"),
        ),
      } satisfies DataItem;
    });
  }
}

export const portfolioBigNumbersHandler = new PortfolioBigNumbersHandler();
