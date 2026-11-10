import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  collectShowGlobalDataDatasetConfigs,
  hasGlobalDataForSubject,
} from "@domain/config/presets/show-global-data/show-global-data.datasets";
import type { ShowGlobalDataKpi } from "@domain/config/presets/show-global-data/show-global-data.types";
import {
  PresetDefinition,
  PresetResponse,
  PresetValue,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
import { zonesRegistry } from "@domain/registries/zones.registry";
import {
  ZonesEntry,
  ZonesPresetValue,
  isZonesFilterItem,
} from "@domain/config/presets/zones/zones.types";
import { countriesRegistry } from "@domain/registries/countries.registry";
import { computeEffectiveZones } from "@domain/config/presets/common/effective-zones";
import {
  computeZoneCountryDefaults,
  type ZoneCountryEntry,
} from "@domain/config/presets/common/zone-country-defaults";
import { pageAllowsAllOptions } from "@domain/config/presets/common/no-validation-pages";
import { getCountryFlag } from "@common/utils/images/country-image.utils";

const GLOBAL_ZONE = "ABI";

/**
 * Zone filter handler.
 *
 * Builds the response entirely from the central `zonesRegistry`.
 * Optional Databricks datasets apply when `hideGlobalForKpi` is set.
 * Each `ZonesFilterItem` entry in the preset is replaced by a `ZonesPresetValue` with a flat `values`
 * list of zone rows (`value`, `label`, `quick_filter_label`).
 *
 * The effective zone set is delegated to {@link computeEffectiveZones}
 * so the `country` and `zone` presets stay perfectly consistent: a
 * country bucket is only emitted when its zone appears here, and a
 * zone is only emitted when the user can reach it (either directly via
 * a `ZoneViewer:*` scope, transitively via an accessible country, or
 * implicitly in `unrestricted`/`all` mode).
 *
 * The synthetic `ABI` (Global) row is controlled exclusively by the
 * `scope` filter: list it (or omit `scope` entirely) to include the
 * row, leave it out of a non-empty list to hide it.
 */
class ZonesFilterHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(preset: PresetDefinition): DatasetConfig[] {
    const subjects: ShowGlobalDataKpi[] = [];
    for (const value of Object.values(preset)) {
      if (isZonesFilterItem(value) && value.hideGlobalForKpi) {
        subjects.push(value.hideGlobalForKpi);
      }
    }
    return collectShowGlobalDataDatasetConfigs(subjects);
  }

  handle(
    preset: PresetDefinition,
    datasets?: Dataset[],
    user?: UserEntity,
  ): PresetResponse {
    const result: PresetResponse = {};

    for (const [key, value] of Object.entries(preset)) {
      if (!isZonesFilterItem(value)) {
        result[key] = value;
        continue;
      }

      const allowAllOptions = pageAllowsAllOptions(value.page);

      const { effective: rawEffective } = computeEffectiveZones(
        value.scope,
        user,
        { skipReachabilityFilter: allowAllOptions },
      );
      const kpiBlocksGlobal =
        value.hideGlobalForKpi != null &&
        !hasGlobalDataForSubject(datasets, value.hideGlobalForKpi);
      const suppressGlobal = coerceBool(value.excludeGlobal) || kpiBlocksGlobal;
      const effective = applyExcludeGlobal(rawEffective, suppressGlobal);
      const availableCountryIds = resolveAvailableCountryIds(
        value.countryScope,
        user,
        allowAllOptions,
      );
      const defaults = computeZoneCountryDefaults(
        effective,
        user,
        availableCountryIds,
      );

      const item: ZonesPresetValue = {
        values: this.buildValues(effective),
        default: zoneDefaultWithImageUrl(defaults.zone),
        enabled: true,
      };

      result[key] = item as PresetValue;
    }

    return result;
  }

  private buildValues(zoneIds: string[]): ZonesEntry[] {
    const records = zoneIds
      .map((id) => zonesRegistry[id])
      .filter((record): record is NonNullable<typeof record> =>
        Boolean(record),
      );

    const global = records.filter((r) => r.id === GLOBAL_ZONE);
    const regional = records
      .filter((r) => r.id !== GLOBAL_ZONE)
      .sort((a, b) => a.title.localeCompare(b.title));

    return [...global, ...regional].map((record) => ({
      value: record.id,
      label: record.title,
      quick_filter_label: record.quick_filter_label,
      image_url: getCountryFlag(record.id),
    }));
  }
}

/**
 * Mirror of {@link CountryFilterHandler}'s available-country logic
 * for the `zone.default` computation. Resolves the country ids the
 * sibling `country` preset will emit:
 *
 *   1. Start from `countryScope` (page-level country list mirrored
 *      from the `country` preset). When omitted, the universe is
 *      every registered country.
 *   2. Drop unknown ids and the synthetic `ABI`.
 *   3. Trim by per-country JWT access (`unrestricted`/`all` keep all,
 *      `deny` keeps none, `explicit` intersects with `iso3Set`), unless
 *      `skipPolicyTrim` is set for `NO_VALIDATION_PAGES`.
 *
 * Returns `undefined` when no restriction applies (so
 * `computeZoneCountryDefaults` falls back to its baseline behavior).
 */
/**
 * Drop the synthetic `ABI` (Global) zone from the effective set when
 * `suppressGlobal` is true (page-level `excludeGlobal` and/or KPI flag).
 */
function applyExcludeGlobal(
  effective: string[],
  suppressGlobal: unknown,
): string[] {
  if (!coerceBool(suppressGlobal)) {
    return effective;
  }
  return effective.filter((id) => id !== GLOBAL_ZONE);
}

function coerceBool(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

function resolveAvailableCountryIds(
  countryScope: string[] | undefined,
  user: UserEntity | undefined,
  skipPolicyTrim = false,
): Set<string> | undefined {
  const fromScope =
    countryScope && countryScope.length > 0
      ? countryScope.filter(
          (id) => id !== GLOBAL_ZONE && Boolean(countriesRegistry[id]),
        )
      : Object.keys(countriesRegistry).filter((id) => id !== GLOBAL_ZONE);

  if (skipPolicyTrim || !user) {
    return new Set(fromScope);
  }

  const policy = user.policy;
  switch (policy.mode) {
    case "unrestricted":
    case "all":
      return new Set(fromScope);
    case "deny":
      return new Set<string>();
    case "explicit":
      return new Set(fromScope.filter((id) => policy.iso3Set.has(id)));
  }
}

function zoneDefaultWithImageUrl(zone: ZoneCountryEntry): ZonesEntry {
  return {
    ...zone,
    image_url: getCountryFlag(zone.value),
  };
}

export const zonesHandler = new ZonesFilterHandler();
