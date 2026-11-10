import { BaseHandler } from "@domain/handlers/handler.base";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { getBrandImage } from "@common/utils/images/brand-image.utils";

const BRAND_REQUIRED_PAGE_TYPES = [
  "Global Brands",
  "Non Alc Beer",
  "Beyond Beer",
];
/**
 * Value Creation - PR Pages - Volume - Properties Table Handler
 * Handles the raw data from the Value Creation - PR Pages - Volume - Properties Table SQL query
 */
class PropertiesTableHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    const pageType = defaultDataset.data[0].page_type as string;
    const isBrandRequired = BRAND_REQUIRED_PAGE_TYPES.includes(pageType);

    return defaultDataset.data.map((item) => {
      if (isBrandRequired) {
        item.brand = {
          imageSquare: getBrandImage(item.priorities as string, {
            format: "square",
          }),
          imageTable: getBrandImage(item.priorities as string, {
            format: "table",
          }),
        };
      }

      return item;
    });
  }
}

export const propertiesTableHandler = new PropertiesTableHandler();
