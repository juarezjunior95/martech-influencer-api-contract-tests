import commercialResultsPresetConfig from "@domain/config/presets/commercial-results/commercial-results.preset";
import {
  COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
  CommercialResultsFilterResponse,
} from "@domain/config/presets/commercial-results/commercial-results.types";
import { Dataset, Filter } from "@domain/entities/common/base-config.entity";
import { PresetConfig, PresetEntity } from "@domain/entities/preset.entity";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";

const SOCIOS_CHANNEL = '3rd Party (Distributors, Wholesalers, "Socios")';

class StubCommercialResultsPresetEntity extends PresetEntity {
  protected async loadDatasets(): Promise<Dataset[]> {
    return [
      {
        id: COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
        data: [
          {
            country_iso_code_3: "COL",
            zone: "MAZ",
            region: "All",
            period: "YTD",
            brand: "Aguila",
            sub_brand: "Aguila",
            sku: "All",
            channel: SOCIOS_CHANNEL,
            pack_type: "Bottle",
            category: "Beer",
            non_alc_beer: "No",
            growth_levers: "Core",
            beer_price_segment: "Mainstream",
            portfolio: "Core",
          },
        ],
      },
    ];
  }
}

describe("Commercial Results preset HTTP override pipeline", () => {
  it("preserves a scalar channel containing commas when building aggregate filters", async () => {
    const config: PresetConfig = {
      ...commercialResultsPresetConfig,
      preset: {
        commercial_results_filters: {
          brand: "All",
        },
      },
    };
    const entity = new StubCommercialResultsPresetEntity(
      {} as DatasetRepositoryFactory,
      config,
      "commercial-results",
    );
    const filters: Filter[] = [
      {
        namespace: "commercial_results_filters",
        name: "country",
        value: "COL",
      },
      {
        namespace: "commercial_results_filters",
        name: "zone",
        value: "MAZ",
      },
      {
        namespace: "commercial_results_filters",
        name: "brand",
        value: "All",
      },
      {
        namespace: "commercial_results_filters",
        name: "channel",
        value: SOCIOS_CHANNEL,
      },
    ];

    const response = (await entity.fetch(
      filters,
    )) as unknown as CommercialResultsFilterResponse;

    expect(response.brands.enabled).toBe(true);
    expect(response.brands.values.map((option) => option.value)).toEqual([
      "All",
      "Aguila",
    ]);
    expect(response.pack_type.values.map((option) => option.value)).toEqual([
      "All",
      "Bottle",
    ]);
  });
});
