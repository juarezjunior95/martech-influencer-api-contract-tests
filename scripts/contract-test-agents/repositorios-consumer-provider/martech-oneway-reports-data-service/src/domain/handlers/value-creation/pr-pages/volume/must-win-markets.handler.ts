import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
/**
 * Value Creation - PR Pages - Volume - Must Win Markets Handler
 * Handles the raw data from the Value Creation - PR Pages - Volume - Must Win Markets SQL query
 */
class MustWinMarketsHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const variationDirectionVsLy = formatDirection(Number(item.ac_vs_ly));
      const variationDirectionAc = formatDirection(Number(item.ac));

      const countries = (item.countries as string) ?? "";
      const countriesList = countries.split(";");
      const countriesImages = countriesList.map((country) => {
        return {
          alt: country,
          src: getCountryFlag(country, {
            format: "icon",
          }),
        };
      });

      return {
        dt_ini: item.dt_ini,
        dt_end: item.dt_end,
        period: item.period,
        row_label: item.row_label,
        priorities: item.priorities,
        countries: countriesList,
        countriesImages,
        ac: item.ac,
        variationDirectionAc,
        ac_vs_ly: item.ac_vs_ly,
        vs_ly_pp: item.vs_ly_pp,
        variationDirectionVsLy,
        comp_unit_of_measure: item.comp_unit_of_measure,
      };
    });
  }
}

export const mustWinMarketsHandler = new MustWinMarketsHandler();
