import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * Single portfolio row emitted in `values` and `default`.
 *
 * Mirrors Drupal `Portfolio::getPortfolios` value/label pairs plus the
 * synthetic `ALL` row when `includeAll` is set (Drupal `Portfolios` filter).
 */
export interface PortfolioTuple {
  value: string;
  label: string;
  full: string;
}

export interface PortfolioPresetValue {
  enabled: boolean;
  default: PortfolioTuple | Record<string, never>;
  values: PortfolioTuple[];
}

/**
 * Author-facing config for the `portfolio` preset (parity with Drupal
 * `Portfolios` filter configuration keys, camelCased for query overrides).
 *
 *   - `includeAll`: prepend the synthetic `ALL` / `All` row (Drupal
 *     `include_all`).
 *   - `ignoreNab`: drop the `NAB` option (Drupal `ignore_nab`).
 *   - `noDefault`: collapse `default` to empty strings (Drupal
 *     `no_default`).
 *
 * Overrides merge via `?portfolio[includeAll]=true`, etc.
 */
export interface PortfolioPresetConfig {
  includeAll?: boolean;
  ignoreNab?: boolean;
  noDefault?: boolean;
}

const ALL_PORTFOLIO: PortfolioTuple = {
  value: "ALL",
  label: "All",
  full: "",
};

const NO_DEFAULT_PORTFOLIO: PortfolioTuple = {
  value: "",
  label: "",
  full: "",
};

/**
 * Canonical list from Drupal `Portfolio::getPortfolios()` (order preserved).
 */
const BASE_PORTFOLIOS: ReadonlyArray<PortfolioTuple> = [
  { value: "Megabrands", label: "Megabrands", full: "" },
  { value: "Expansion", label: "Expansion", full: "" },
  { value: "Sustain", label: "Sustain", full: "" },
  { value: "Tail", label: "Tail", full: "" },
  { value: "NAB", label: "Non-Alcohol Beer", full: "" },
];

/**
 * Portfolio preset handler.
 *
 * Builds the response from the static registry — no Databricks dataset.
 * Processing order matches Drupal `Portfolios::retrievePortfolioOptions`:
 * base list → optional `includeAll` prepend → optional `ignoreNab` filter.
 * Default is always `reset($portfolio)` i.e. the first tuple after those steps,
 * unless `noDefault` is set.
 */
class PortfolioPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const portfolioConfig = (preset.portfolio ?? {}) as PortfolioPresetConfig;
    const includeAll = this.toBool(portfolioConfig.includeAll);
    const ignoreNab = this.toBool(portfolioConfig.ignoreNab);
    const noDefault = this.toBool(portfolioConfig.noDefault);

    const values = this.buildValues(includeAll, ignoreNab);

    const defaultTuple: PortfolioPresetValue["default"] =
      noDefault || values.length === 0
        ? { ...NO_DEFAULT_PORTFOLIO }
        : { ...values[0] };

    const portfolioValue: PortfolioPresetValue = {
      values,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, portfolio: portfolioValue };
  }

  private buildValues(
    includeAll: boolean,
    ignoreNab: boolean,
  ): PortfolioTuple[] {
    let rows = BASE_PORTFOLIOS.map((row) => ({ ...row }));

    if (includeAll) {
      rows = [{ ...ALL_PORTFOLIO }, ...rows];
    }

    if (ignoreNab) {
      rows = rows.filter((row) => row.value !== "NAB");
    }

    return rows;
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

export const portfolioHandler = new PortfolioPresetHandler();
