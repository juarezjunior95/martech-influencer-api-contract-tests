import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * Single product scope row emitted in `values` and `default`.
 *
 * `value` is the canonical short code; `label` is the user-facing
 * string; `full` is reserved for a longer description.
 */
export interface ProductScopeTuple {
  value: string;
  label: string;
  full: string;
}

export interface ProductScopePresetValue {
  enabled: boolean;
  default: ProductScopeTuple;
  values: ProductScopeTuple[];
}

/**
 * Author-facing config for the `product-scope` preset.
 *
 * The handler emits a fixed payload — there are no scope or
 * permission levers. The interface is kept so the preset file can
 * remain typed and future toggles can be added without breaking
 * callers.
 */
export type ProductScopePresetConfig = Record<string, never>;

/**
 * Canonical, fixed product scope registry. Order here is the
 * emission order in the response and the first entry is the
 * implicit default.
 */
const ALL_PRODUCT_SCOPES: ProductScopeTuple[] = [
  {
    value: "Beer + Adjacencies",
    label: "Beer + Adjacencies",
    full: "Beer + Adjacencies (excluding Soft Drinks)",
  },
  {
    value: "Total ABI",
    label: "Total ABI",
    full: "Total ABI (including Soft Drinks)",
  },
];

/**
 * Product Scope preset handler.
 *
 * Emits a fully static payload — no Databricks dataset is declared
 * and no preset/query lever is consumed. The first row of
 * {@link ALL_PRODUCT_SCOPES} (Beer + Adjacencies) is always returned
 * as the default.
 */
class ProductScopePresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values = ALL_PRODUCT_SCOPES.map((tuple) => ({ ...tuple }));

    const productScopeValue: ProductScopePresetValue = {
      values,
      default: { ...values[0] },
      enabled: true,
    };

    return { ...preset, "product-scope": productScopeValue };
  }
}

export const productScopeHandler = new ProductScopePresetHandler();
