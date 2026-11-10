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
import {
  CountryRecord,
  countriesRegistry,
} from "@domain/registries/countries.registry";
import {
  CountryDefault,
  CountryEntry,
  CountryFilterItem,
  CountryPresetValue,
  CountryValuesByZone,
  isCountryFilterItem,
} from "@domain/config/presets/country/country.types";
import { computeEffectiveZones } from "@domain/config/presets/common/effective-zones";
import { computeZoneCountryDefaults } from "@domain/config/presets/common/zone-country-defaults";
import { pageAllowsAllOptions } from "@domain/config/presets/common/no-validation-pages";
import { getCountryFlag } from "@common/utils/images/country-image.utils";

const GLOBAL_ZONE = "ABI";

/**
 * Country filter handler.
 *
 * Replaces the legacy Drupal `Countries` plugin. The response is built
 * entirely from the central `countriesRegistry`. Optional Databricks
 * datasets apply when `hideGlobalForKpi` is set (see
 * {@link CountryFilterItem.hideGlobalForKpi}). Each `CountryFilterItem`
 * entry in the preset is replaced by a `CountryPresetValue` keyed by zone:
 *
 *   - `values.ABI` is the synthetic Global bucket: the `ABI` row is
 *     emitted first, followed by every accessible country (zone-tagged).
 *     Only emitted when the `ABI` zone is itself part of the
 *     effective zone set (so `country.values.ABI` and `zone.values`
 *     never disagree).
 *   - `values.<zone>` (AFR, APAC, EUR, MAZ, NAZ, SAZ) holds only the
 *     countries that belong to that zone AND that the user can access.
 *
 * Defaults (`value`/`label`) are computed per-request via
 * {@link computeZoneCountryDefaults} so they always point at a country
 * the caller can reach (or `ABI` when the Global zone is in scope).
 * `full` keeps coming from the static `country_group` config for
 * legacy Drupal payload parity.
 *
 * The effective zone set is delegated to {@link computeEffectiveZones}
 * so the `country` and `zone` presets stay perfectly consistent. JWT
 * country access is then applied to drop individual rows inside each
 * surviving bucket; empty buckets are pruned.
 */
class CountryFilterHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(preset: PresetDefinition): DatasetConfig[] {
    const subjects: ShowGlobalDataKpi[] = [];
    for (const value of Object.values(preset)) {
      if (isCountryFilterItem(value) && value.hideGlobalForKpi) {
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
      if (!isCountryFilterItem(value)) {
        result[key] = value;
        continue;
      }

      const allowAllOptions = pageAllowsAllOptions(value.page);

      const { effective: rawEffective, includesGlobal: rawIncludesGlobal } =
        computeEffectiveZones(value.zoneScope, user, {
          skipReachabilityFilter: allowAllOptions,
        });
      const kpiBlocksGlobal =
        value.hideGlobalForKpi != null &&
        !hasGlobalDataForSubject(datasets, value.hideGlobalForKpi);
      const suppressGlobal = coerceBool(value.excludeGlobal) || kpiBlocksGlobal;
      const effective = suppressGlobal
        ? rawEffective.filter((id) => id !== GLOBAL_ZONE)
        : rawEffective;
      const includesGlobal = suppressGlobal ? false : rawIncludesGlobal;
      const allowedZones = new Set(effective);

      const records = this.selectCountries(value, allowedZones);
      const buckets = this.buildValuesByZone(
        records,
        allowedZones,
        includesGlobal,
      );
      const trimmed = allowAllOptions
        ? buckets
        : this.applyCountryAccess(buckets, user);
      const availableCountryIds = collectCountryIds(trimmed);
      const defaults = computeZoneCountryDefaults(
        effective,
        user,
        availableCountryIds,
      );

      const item: CountryPresetValue = {
        values: trimmed,
        default: this.buildDefault(defaults.country),
        enabled: true,
      };

      result[key] = item as PresetValue;
    }

    return result;
  }

  /**
   * Filter the registry down to the countries this preset cares about,
   * intersecting (in order):
   *   1. The page-level `zoneScope` (already baked into `allowedZones`
   *      via {@link computeEffectiveZones}).
   *   2. The per-page `scope` config.
   */
  private selectCountries(
    filter: CountryFilterItem,
    allowedZones: Set<string>,
  ): CountryRecord[] {
    const all = Object.values(countriesRegistry);

    const zoneFiltered = all.filter((record) => allowedZones.has(record.zone));

    const ids = filter.scope;
    if (!ids || ids.length === 0) {
      return zoneFiltered;
    }
    const allowedIds = new Set(ids);
    return zoneFiltered.filter((record) => allowedIds.has(record.id));
  }

  /**
   * Build the zone-keyed bucket map. Only zones in `allowedZones` get
   * a bucket; the synthetic `ABI` bucket is gated behind the explicit
   * `includesGlobal` flag so it never appears alone (the matching
   * `zone.values` row is computed from the same source).
   */
  private buildValuesByZone(
    records: CountryRecord[],
    allowedZones: Set<string>,
    includesGlobal: boolean,
  ): CountryValuesByZone {
    const sorted = [...records].sort((a, b) => a.title.localeCompare(b.title));

    const values: CountryValuesByZone = {};
    if (includesGlobal) {
      values[GLOBAL_ZONE] = [this.buildGlobalEntry()];
    }

    for (const record of sorted) {
      if (!allowedZones.has(record.zone)) {
        continue;
      }
      const entry: CountryEntry = {
        value: record.id,
        label: record.title,
        zone: record.zone,
        quick_filter_label: record.quick_filter_label,
        image_url: getCountryFlag(record.id),
      };

      if (includesGlobal) {
        values[GLOBAL_ZONE].push(entry);
      }

      const zoneBucket = values[record.zone] ?? [];
      zoneBucket.push(entry);
      values[record.zone] = zoneBucket;
    }

    return values;
  }

  private buildGlobalEntry(): CountryEntry {
    return {
      value: GLOBAL_ZONE,
      label: "All",
      zone: GLOBAL_ZONE,
      quick_filter_label: "Global",
      image_url: getCountryFlag(GLOBAL_ZONE),
    };
  }

  /**
   * Trim individual rows inside each bucket using the user's per-country
   * access. Buckets are kept only if at least one row survives. The
   * synthetic Global row inside `values.ABI` is preserved unless the
   * user is in `deny` mode (in which case the bucket is gone earlier
   * because the ABI zone won't be in `effectiveZones`).
   *
   * Pages in `NO_VALIDATION_PAGES` skip both the reachability filter
   * (via {@link computeEffectiveZones}) and this trim in `handle()` so
   * every zone in scope and every country inside those zones is emitted.
   */
  private applyCountryAccess(
    values: CountryValuesByZone,
    user?: UserEntity,
  ): CountryValuesByZone {
    if (
      !user ||
      user.policy.mode === "unrestricted" ||
      user.policy.mode === "all"
    ) {
      return values;
    }
    if (user.policy.mode === "deny") {
      return {};
    }

    const trimmed: CountryValuesByZone = {};
    for (const [zone, entries] of Object.entries(values)) {
      const filtered = entries.filter(
        (entry) =>
          entry.value === GLOBAL_ZONE || user.hasCountryAccess(entry.value),
      );
      if (filtered.length > 0) {
        trimmed[zone] = filtered;
      }
    }
    return trimmed;
  }

  /**
   * Compose the `CountryDefault` payload from the per-request
   * computed default (`value`/`label`/`quick_filter_label`) and the
   * static `country_group` config (`full` — kept for legacy Drupal
   * payload parity).
   */
  private buildDefault(picked: {
    value: string;
    label: string;
    quick_filter_label: string;
  }): CountryDefault {
    return {
      value: picked.value,
      label: picked.label,
      quick_filter_label: picked.quick_filter_label,
    };
  }
}

/**
 * Coerce a boolean value coming either as a real `boolean` (BFF-side
 * fixed filter) or a stringified `"true"`/`"false"` (query string
 * pipeline) into a single boolean. Anything else is `false`.
 */
function coerceBool(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

/**
 * Flatten the zone-keyed bucket map into the set of country ids that
 * actually survive into the response. Used to feed
 * {@link computeZoneCountryDefaults} so the `default` always points at
 * a country the caller will see in `values`.
 */
function collectCountryIds(values: CountryValuesByZone): Set<string> {
  const ids = new Set<string>();
  for (const entries of Object.values(values)) {
    for (const entry of entries) {
      if (entry.value !== GLOBAL_ZONE) {
        ids.add(entry.value);
      }
    }
  }
  return ids;
}

export const countryHandler = new CountryFilterHandler();
