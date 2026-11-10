import { Logger } from "@nestjs/common";
import {
  BaseConfig,
  BaseConfigEntity,
  DatasetConfig,
  Filter,
} from "@domain/entities/common/base-config.entity";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
import { resolveCountries } from "@domain/registries/resolver";

const overridesLogger = new Logger("PresetEntity.applyOverrides");

/**
 * Option emitted in the flat API response (see RFC §4.6).
 */
export interface PresetItemOption {
  value: string;
  label?: string;
  icon?: string;
  group?: string;
  metadata?: Record<string, unknown>;
}

/**
 * The generic "filter item" shape every preset item that exposes a
 * list of options conforms to. Filter-specific shapes (e.g.
 * `BrandFilterItem`, `BrandPresetValue`, `YearPresetValue`) live
 * alongside their handlers under `config/presets/<name>/` and are
 * NOT known to this file.
 */
export interface PresetItem {
  label: string;
  shortLabel?: string;
  defaultValue?: string;
  options?: PresetItemOption[];
}

/**
 * Declarative reference to country ids from the central registry.
 * Use `["*"]` to include all registered countries.
 *
 * `CountryFilterItem` is the ONE filter type the entity owns
 * directly: country permissions are the global JWT-driven boundary
 * every preset reuses. Other filter types live in their own folders
 * under `config/presets/<name>/` and are never referenced from here.
 */
export interface CountryFilterItem {
  label: string;
  countries: string[];
  shortLabel?: string;
  defaultValue?: string;
}

/**
 * Generic preset value union. Filter-specific payload types are
 * unioned in via the open `object` branch — the entity treats them
 * opaquely.
 */
/**
 * `object` is intentional: filter-specific payload interfaces (e.g.
 * `YearPresetValue`, `BrandPresetValue`) are assigned opaquely.
 * TypeScript interfaces lack implicit index signatures, so
 * `Record<string, unknown>` would reject them. Use the type-guard
 * functions (`isCountryFilterItem`, `isPresetItem`, `isBrandFilterItem`)
 * for narrowing instead of `typeof` checks.
 */
export type PresetValue =
  | PresetItem
  | CountryFilterItem
  | object
  | string
  | number
  | boolean;

export interface PresetDefinition {
  [key: string]: PresetValue;
}

/**
 * `TPreset` is the author-facing preset shape (which may include
 * `CountryFilterItem` references and any filter-specific shapes the
 * preset's handler understands).
 */
export interface PresetConfig<
  TPreset extends PresetDefinition = PresetDefinition,
> extends BaseConfig {
  preset?: TPreset;
  handler?: IPresetHandler<PresetResponse>;
}

export interface PresetResponse {
  [key: string]: PresetValue;
}

function isCountryFilterItem(value: PresetValue): value is CountryFilterItem {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as CountryFilterItem).countries) &&
    typeof (value as { source?: unknown }).source !== "string"
  );
}

function isPresetItem(value: PresetValue): value is PresetItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as PresetItem).label === "string" &&
    Array.isArray((value as PresetItem).options)
  );
}

/**
 * Generic helper: idempotently append a `DatasetConfig` to a config's
 * `datasets` array, deduping by `id`. Used by the entity to merge
 * datasets declared by a handler's `datasets()` hook before
 * `loadDatasets` runs.
 */
export function ensureDataset(
  config: { datasets?: DatasetConfig[] },
  datasetConfig: DatasetConfig,
): void {
  const list = config.datasets ?? [];
  if (datasetConfig.id && list.some((d) => d.id === datasetConfig.id)) {
    return;
  }
  config.datasets = [...list, datasetConfig];
}

/**
 * Generic helper: merge handler-declared static filters with the
 * filters supplied by the request. Request filters take precedence
 * (matched by `name`) so callers can still override handler defaults.
 *
 * Symmetrical to `ensureDataset` — used by the entity to inject
 * filter values that don't come from the request (e.g. legacy
 * config-group constants) before `loadDatasets` runs.
 */
export function mergeHandlerFilters(
  requestFilters: Filter[],
  handlerFilters: Filter[],
): Filter[] {
  if (handlerFilters.length === 0) {
    return requestFilters;
  }
  const provided = new Set(requestFilters.map((f) => f.name));
  const additions = handlerFilters.filter((f) => !provided.has(f.name));
  return additions.length === 0
    ? requestFilters
    : [...requestFilters, ...additions];
}

/**
 * Generic helper: trim a country-keyed map by `user.hasCountryAccess`.
 *
 * Reuses the global JWT-driven policy (`unrestricted` / `all` / `explicit`
 * / `deny`) so handlers don't re-implement the matrix. `keepKeys` lets
 * a handler protect synthetic pseudo-countries (e.g. brand `ABI` in
 * `explicit` modes); they are still dropped in `deny` mode.
 */
export function trimByCountryAccess<T>(
  map: Record<string, T>,
  user: UserEntity,
  options: { keepKeys?: string[] } = {},
): Record<string, T> {
  if (user.policy.mode === "unrestricted" || user.policy.mode === "all") {
    return map;
  }

  if (user.policy.mode === "deny") {
    return {};
  }

  const keep = new Set(options.keepKeys ?? []);
  const out: Record<string, T> = {};
  for (const [key, value] of Object.entries(map)) {
    if (keep.has(key) || user.hasCountryAccess(key)) {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Convert a snake_case identifier (`include_all_sub_brands`) to the
 * camelCase TypeScript field name (`includeAllSubBrands`). Idempotent
 * for already-camelCase keys.
 */
function snakeToCamel(name: string): string {
  return name.replace(/_([a-z0-9])/g, (_, ch: string) => ch.toUpperCase());
}

/**
 * Coerce a query-string scalar to its natural JS type:
 *   - `"true"` / `"false"` -> boolean
 *   - integer/decimal strings -> number
 *   - values containing a comma -> trimmed `string[]`
 *   - everything else -> string (passthrough)
 */
function coerceQueryValue(
  value: string | number | boolean,
): string | number | boolean | string[] {
  if (typeof value !== "string") {
    return value;
  }
  if (value.includes(",")) {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  }
  const lower = value.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    const n = Number(value);
    if (String(n) === value) {
      return n;
    }
  }
  return value;
}

/**
 * Group filters by namespace, dropping the legacy `?filter[*]=...`
 * shape (forwarded to `loadDatasets`, never an override). Each entry
 * maps a top-level preset key to a `{ camelName: coercedValue }`
 * object.
 */
function buildOverridesByNamespace(
  filters: Filter[],
): Map<string, Record<string, unknown>> {
  const out = new Map<string, Record<string, unknown>>();

  for (const filter of filters) {
    const namespace = filter.namespace ?? "filter";
    if (namespace === "filter") {
      // `?filter[*]` is the legacy datasource filter shape — forwarded
      // to `loadDatasets`, NOT a per-key config override.
      continue;
    }

    const camelName = snakeToCamel(filter.name);
    const value = coerceQueryValue(filter.value);

    let group = out.get(namespace);
    if (!group) {
      group = {};
      out.set(namespace, group);
    }
    group[camelName] = value;
  }

  return out;
}

/**
 * Apply namespaced query overrides uniformly. Every `?ns[name]=value`
 * merges into `preset[ns][name]` — there are no special-case
 * promotions or per-filter array tables. Plugins that only declare
 * scalar fields simply won't be sent CSVs by clients.
 */
function applyOverrides(
  preset: PresetDefinition,
  filters: Filter[],
): PresetDefinition {
  const overrides = buildOverridesByNamespace(filters);
  if (overrides.size === 0) {
    return preset;
  }

  const merged: PresetDefinition = { ...preset };

  for (const [namespace, overrideValues] of overrides) {
    const existing = merged[namespace];
    if (existing === undefined || existing === null) {
      overridesLogger.warn(
        `Override for unknown preset key '${namespace}' was ignored`,
      );
      continue;
    }

    if (typeof existing !== "object" || Array.isArray(existing)) {
      overridesLogger.warn(
        `Override for non-object preset key '${namespace}' was ignored`,
      );
      continue;
    }

    merged[namespace] = {
      ...(existing as Record<string, unknown>),
      ...overrideValues,
    } as PresetValue;
  }

  return merged;
}

/**
 * Country built-in: replace `CountryFilterItem` references with
 * fully-resolved `PresetItem` objects whose `options` are populated
 * from the central registry. Tracks which top-level keys originated
 * from country references so the permission trim can find them
 * later without re-running the predicate.
 */
function expandCountryItems(preset: PresetDefinition): {
  expanded: PresetResponse;
  countryKeys: Set<string>;
} {
  const expanded: PresetResponse = {};
  const countryKeys = new Set<string>();

  for (const [key, value] of Object.entries(preset)) {
    if (isCountryFilterItem(value)) {
      countryKeys.add(key);
      expanded[key] = {
        label: value.label,
        ...(value.shortLabel ? { shortLabel: value.shortLabel } : {}),
        ...(value.defaultValue ? { defaultValue: value.defaultValue } : {}),
        options: resolveCountries(value.countries).map((country) => ({
          value: country.id,
          label: country.title,
          icon: country.flag_icon,
          group: country.zone,
          metadata: { match_names: country.match_names },
        })),
      };
      continue;
    }
    expanded[key] = value;
  }

  return { expanded, countryKeys };
}

/**
 * Country built-in: trim `options` on every country-sourced item by
 * `user.hasCountryAccess`. `unrestricted` and `all` modes are no-ops;
 * `deny` mode empties `options`.
 */
function applyCountryPermissions(
  response: PresetResponse,
  countryKeys: Set<string>,
  user?: UserEntity,
): PresetResponse {
  if (!user || user.policy.mode === "unrestricted") {
    return response;
  }

  const filtered: PresetResponse = { ...response };

  for (const key of countryKeys) {
    const item = filtered[key];
    if (!isPresetItem(item) || !item.options) {
      continue;
    }

    filtered[key] = {
      ...item,
      options: item.options.filter((option) =>
        user.hasCountryAccess(option.value),
      ),
    };
  }

  return filtered;
}

/**
 * Preset entity.
 *
 * Generic pipeline (RFC §4.7):
 *   1. Apply namespaced query overrides (`?ns[name]=value` ->
 *      `preset.ns.name`). Snake-case + scalar/comma coercion.
 *   2. Expand `CountryFilterItem` references into resolved
 *      `PresetItem`s (the only filter type built into the entity —
 *      the global JWT permission boundary).
 *   3. Merge handler-declared datasets into `config.datasets`.
 *   4. `loadDatasets()` (generic).
 *   5. Run the author-defined handler (filter-specific transforms
 *      live there).
 *   6. Trim country options by `user.hasCountryAccess`.
 *
 * Adding a new filter type means: create a folder under
 * `config/presets/<name>/`, drop a `<name>.preset.ts` referencing a
 * `<name>.handler.ts`. The entity never changes.
 */
export class PresetEntity extends BaseConfigEntity<
  PresetConfig,
  PresetResponse
> {
  constructor(
    datasetRepositoryFactory: DatasetRepositoryFactory,
    presetConfig: PresetConfig,
    name: string,
  ) {
    super(datasetRepositoryFactory, presetConfig, name);
  }

  public async fetch(
    filters: Filter[],
    user?: UserEntity,
  ): Promise<PresetResponse> {
    const rawPreset = this.config?.preset ?? {};

    const overridden = applyOverrides(rawPreset, filters);
    const { expanded, countryKeys } = expandCountryItems(overridden);

    const handler = this.config?.handler;
    if (handler?.datasets) {
      for (const ds of handler.datasets(expanded)) {
        ensureDataset(this.config, ds);
      }
    }

    const effectiveFilters = handler?.filters
      ? mergeHandlerFilters(filters, handler.filters(expanded))
      : filters;

    const datasets = await this.loadDatasets(effectiveFilters);

    const handled = handler?.handle
      ? (handler.handle(expanded, datasets, user) ?? {})
      : expanded;

    return applyCountryPermissions(handled, countryKeys, user);
  }
}
