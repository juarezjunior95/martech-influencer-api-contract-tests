import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { formatMonth } from "@common/utils/month.utils";
import { formatPeriod } from "@common/utils/period.utils";
import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

function getField(item: DataItem, key: string) {
  return item[key] ?? item[key.toLowerCase()];
}

/**
 * Value Creation - Overview - Portfolio Performance Table Handler
 * Handles the raw data from the Value Creation - Overview - Portfolio Performance Table SQL query
 */
class PortfolioPerformanceTableHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const dtEnd = getField(item, "DT_END") as string;
      const dtIni = getField(item, "DT_INI") as string;
      const ac = getField(item, "AC");
      const acVsLy = getField(item, "AC_VS_LY");
      const kpiName = getField(item, "KPI_NAME");
      const rawBrand = getField(item, "RAW_BRAND") as string;
      const rawCountry = getField(item, "COUNTRY_ISO_CODE_3") as string;

      const refreshMonthLabel = formatMonth(dtEnd, {
        includeYear: true,
        yearFormat: "short",
      });
      const refreshPeriodLabel = formatPeriod(dtIni, dtEnd, {
        alwaysUseQuarter: true,
        includeYear: true,
        yearFormat: "short",
      });
      const variationDirectionVsLy = formatDirection(Number(acVsLy));
      const variationDirectionAc = formatDirection(Number(ac));

      const unitMeasure = kpiName === "power" ? "pp" : "%";
      const brandImage = getBrandImage(rawBrand, {
        format: "square",
      });
      const countryImage = getCountryFlag(rawCountry, { format: "icon" });

      return {
        segment: getField(item, "SEGMENT"),
        kpi_name: kpiName,
        ac,
        comp_ac_direction: variationDirectionAc,
        ac_vs_ly: acVsLy,
        comp_ac_ly_direction: variationDirectionVsLy,
        unit_measure: unitMeasure,
        country: rawCountry,
        brand: rawBrand,
        brand_family: getField(item, "BRAND_FAMILY"),
        brand_image: brandImage,
        country_image: countryImage,
        period_refresh: refreshPeriodLabel,
        month_refresh: refreshMonthLabel,
      };
    });
  }
}

export const portfolioPerformanceTableHandler =
  new PortfolioPerformanceTableHandler();
