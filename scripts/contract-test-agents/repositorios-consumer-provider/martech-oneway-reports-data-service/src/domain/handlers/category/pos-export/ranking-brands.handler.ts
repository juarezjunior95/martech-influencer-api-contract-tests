import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Category - POS Results Export - Ranking Brands Handler
 *
 * The ranking procedures name their columns `brand` and `country`, but
 * {@link KpiEntity} only derives the brand artwork from `raw_brand` and the
 * country flag from `image_key`. This handler renames both so the entity — which
 * runs after it via `entityClassAfterHandler` — can build the images the
 * `table_brands` slides need. The original values are kept alongside so the
 * formatter can still group and label by them.
 */
class RankingBrandsHandler extends BaseHandler {
  async handle(
    datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    const dataset = defaultDataset ?? datasets[0];

    return (dataset?.data ?? []).map((item) => {
      const brand = this.getValue(item, "BRAND", "brand");
      const country = this.getValue(item, "COUNTRY", "country");

      return {
        ...item,
        brand_label: brand,
        country_code: country,
        ...(brand !== undefined ? { raw_brand: brand } : {}),
        ...(country !== undefined ? { image_key: country } : {}),
      };
    });
  }

  /**
   * Reads a column regardless of the casing the warehouse returns it in.
   */
  private getValue(item: DataItem, ...keys: string[]): string | undefined {
    for (const key of keys) {
      if (item[key] !== undefined && item[key] !== null) {
        return String(item[key]);
      }
    }

    return undefined;
  }
}

export default new RankingBrandsHandler();
