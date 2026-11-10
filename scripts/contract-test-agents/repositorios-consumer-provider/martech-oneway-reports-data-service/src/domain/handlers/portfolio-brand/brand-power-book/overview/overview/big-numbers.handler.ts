import { labelVsLq, labelVsLy, labelRefresh } from "@common/utils/label.utils";
import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

class BigNumbersHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const labelVsLqValue = labelVsLq({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
      });

      const labelVsLyValue = labelVsLy({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
      });

      const labelRefreshValue = labelRefresh({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
      });

      const variationDirectionVsLy = formatDirection(Number(item.AC_VS_LY));
      const variationDirectionVsLq = formatDirection(Number(item.AC_VS_LQ));

      return {
        value: item.AC,
        variation_vs_ly: item.AC_VS_LY,
        variation_vs_lq: item.AC_VS_LQ,
        variation_direction_vs_ly: variationDirectionVsLy,
        variation_direction_vs_lq: variationDirectionVsLq,
        label_refresh: labelRefreshValue,
        label_vs_lq: labelVsLqValue,
        label_vs_ly: labelVsLyValue,
      };
    });
  }
}

export const bigNumbersHandler = new BigNumbersHandler();
