import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: Price Segments.
 *
 * Resolves as API name `sub-filters_price-segments`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "price-segments": {
      filters: [],
    },
  },
};

export default config;
