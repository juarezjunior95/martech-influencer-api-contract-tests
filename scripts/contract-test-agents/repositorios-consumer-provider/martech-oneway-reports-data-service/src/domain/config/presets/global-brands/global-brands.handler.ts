import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * One selectable row inside a {@link GlobalBrandsGroupBlock}.
 *
 * Mirrors Drupal `ValueLabelTupleDto` plus `full` for parity with
 * {@link PortfolioTuple} / {@link SegmentTuple}.
 */
export interface GlobalBrandTuple {
  value: string;
  label: string;
  full: string;
}

/**
 * One opt-group block, matching {@link GlobalBrand::getAllAsTuple}
 * (`group` + `values`).
 */
export interface GlobalBrandsGroupBlock {
  group: string;
  values: GlobalBrandTuple[];
}

export interface GlobalBrandsPresetValue {
  enabled: boolean;
  default: GlobalBrandTuple | Record<string, never>;
  values: GlobalBrandsGroupBlock[];
}

/**
 * Author-facing config for the `global-brands` preset (Drupal
 * `GlobalBrands` / `no_default`, camelCased for query overrides).
 *
 *   - `noDefault`: collapse `default` to empty strings (Drupal
 *     `no_default`).
 *
 * Overrides merge via `?global-brands[noDefault]=true`.
 */
export interface GlobalBrandsPresetConfig {
  noDefault?: boolean;
}

const NO_DEFAULT_TUPLE: GlobalBrandTuple = {
  value: "",
  label: "",
  full: "",
};

/**
 * ABI global brands — order matches Drupal {@link GlobalBrand::getAll}.
 */
const ABI_GLOBAL_BRANDS: ReadonlyArray<GlobalBrandTuple> = [
  { value: "All Global Brands", label: "All Global Brands", full: "" },
  { value: "Michelob Ultra", label: "Michelob Ultra", full: "" },
  { value: "Budweiser", label: "Budweiser", full: "" },
  { value: "Corona", label: "Corona", full: "" },
  { value: "Stella Artois", label: "Stella Artois", full: "" },
];

/**
 * Competitor brands — matches Drupal {@link GlobalBrand::getAllCompetitorBrands}.
 */
const COMPETITOR_GLOBAL_BRANDS: ReadonlyArray<GlobalBrandTuple> = [
  { value: "Heineken", label: "Heineken", full: "" },
];

/**
 * Global-brands preset handler.
 *
 * Builds grouped options from the static registry (no Databricks).
 * Shape mirrors Drupal `GlobalBrand::getAllAsTuple`. Default is the
 * first tuple in the first group (`All Global Brands`), unless
 * `noDefault` is set — aligned with `GlobalBrands::getDefaultOption`
 * intent (Drupal currently references an undefined `$segments` there).
 */
class GlobalBrandsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const cfg = (preset["global-brands"] ?? {}) as GlobalBrandsPresetConfig;
    const noDefault = this.toBool(cfg.noDefault);

    const groups = this.buildGroups();
    const firstTuple = this.firstTuple(groups);

    const defaultTuple: GlobalBrandsPresetValue["default"] =
      noDefault || !firstTuple ? { ...NO_DEFAULT_TUPLE } : { ...firstTuple };

    const globalBrandsValue: GlobalBrandsPresetValue = {
      values: groups,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, "global-brands": globalBrandsValue };
  }

  private buildGroups(): GlobalBrandsGroupBlock[] {
    return [
      {
        group: "",
        values: ABI_GLOBAL_BRANDS.map((row) => ({ ...row })),
      },
      {
        group: "Competitor",
        values: COMPETITOR_GLOBAL_BRANDS.map((row) => ({ ...row })),
      },
    ];
  }

  private firstTuple(
    groups: GlobalBrandsGroupBlock[],
  ): GlobalBrandTuple | undefined {
    for (const block of groups) {
      const head = block.values[0];
      if (head) {
        return head;
      }
    }
    return undefined;
  }

  private toBool(value: unknown): boolean {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return false;
  }
}

export const globalBrandsHandler = new GlobalBrandsPresetHandler();
