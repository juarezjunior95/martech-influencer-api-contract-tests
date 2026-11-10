import { PresetConfig } from "@domain/entities/preset.entity";
import {
  productScopeHandler,
  ProductScopePresetConfig,
} from "@domain/config/presets/product-scope/product-scope.handler";

/**
 * `product-scope` preset — exposes the supported product scope codes
 * (Beer + Adjacencies, Total ABI) as a flat selectable list.
 *
 * Endpoint: `GET /v1/presets/product-scope`.
 *
 * The handler builds the payload entirely from the static product scope
 * registry; no Databricks dataset is declared. The preset is fully static
 * with no query parameters or page-level overrides.
 */
const productScopePreset: { "product-scope": ProductScopePresetConfig } = {
  "product-scope": {},
};

const config: PresetConfig<typeof productScopePreset> = {
  version: "1.0.0",
  handler: productScopeHandler,
  preset: productScopePreset,
};

export default config;
