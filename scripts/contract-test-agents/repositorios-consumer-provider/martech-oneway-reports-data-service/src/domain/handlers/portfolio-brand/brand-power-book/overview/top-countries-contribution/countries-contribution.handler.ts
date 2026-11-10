import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { labelVsLy } from "@common/utils/label.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { formatPeriod } from "@common/utils/period.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Brand Power Book Performance Breakdown By Top Countries Contribution Handler
 * Handles the raw data from the brand power book Performance Breakdown By Top Countries Contribution SQL query
 */
class CountriesContributionHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const period = formatPeriod(
        item.DT_INI as string,
        item.DT_END as string,
        {
          includeYear: true,
          yearFormat: "short",
        },
      );
      const formattedPeriod = `[${period}]`;

      const labelVsLyValue = labelVsLy({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
      });
      const labelLy = `[${labelVsLyValue}]`;
      const labelFormattedLy = labelLy.replace("vs ", "");

      const variationDirectionVsLy = formatDirection(Number(item.AC_VS_LY));
      const country_flag = getCountryFlag(item.COUNTRY_ISO_CODE_3 as string);
      return {
        ac_vs_ly_pond: item.AC_VS_LY_POND,
        country: item.COUNTRY_ISO_CODE_3,
        absolute_power_subtitle: formattedPeriod,
        ac: item.AC,
        ly: item.LY,
        comparison_subtitle: labelFormattedLy,
        ac_vs_ly: item.AC_VS_LY,
        nr_contribution_subtitle: formattedPeriod,
        nr_contribution: item.NR_CONTRIBUTION,
        variation_direction_comparison: variationDirectionVsLy,
        country_flag,
      };
    });
  }
}

export const countriesContributionHandler = new CountriesContributionHandler();
