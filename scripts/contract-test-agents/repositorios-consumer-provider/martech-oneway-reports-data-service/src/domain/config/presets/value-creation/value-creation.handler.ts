import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";
import { resolveCountriesByZone } from "@domain/registries/resolver";
import {
  createDeltalakeFetchDataConfig,
  createDeltalakeProcedureFetchDataConfig,
} from "@domain/factories/dataset-repository.factory";
import kpiGroupTimeFrame from "@domain/config/config-groups/kpi-group-time-frame.config";
import { kpiGroupHandler } from "@domain/config/presets/kpi-group/kpi-group.handler";
import {
  KPI_GROUP_DATASET_ID,
  KPI_GROUP_DATASET_QUERY,
} from "@domain/config/presets/kpi-group/kpi-group.types";
import {
  cloneGrowthLeverTemplate,
  VALUE_CREATION_GEO_ABI,
  VALUE_CREATION_GEO_EUR,
  VALUE_CREATION_GEO_MAPPING,
  VALUE_CREATION_GROWTH_LEVERS_TEMPLATE,
} from "@domain/config/presets/value-creation/value-creation.defaults";
import type {
  ValueCreationCountryDimension,
  ValueCreationCountryEntry,
  ValueCreationFilterPresetValue,
  ValueCreationFilterRawRow,
  ValueCreationPeriodOption,
  ValueCreationPeriodsDimension,
  ValueCreationZonesDimension,
  ValueCreationZoneOption,
} from "@domain/config/presets/value-creation/value-creation.types";
import {
  VALUE_CREATION_DATASET_ID,
  VALUE_CREATION_FILTER_SP_NAME,
} from "@domain/config/presets/value-creation/value-creation.types";
import { getCountryFlag } from "@common/utils/images/country-image.utils";

/** Same ordering as {@link zonesRegistry} / Drupal `Zone::getAllWithOptionalGlobal`. */
const ZONE_CODES_IN_ORDER = [
  VALUE_CREATION_GEO_ABI,
  "AFR",
  "APAC",
  VALUE_CREATION_GEO_EUR,
  "MAZ",
  "NAZ",
  "SAZ",
] as const;

class ValueCreationPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(): DatasetConfig[] {
    return [
      {
        id: KPI_GROUP_DATASET_ID,
        config: createDeltalakeFetchDataConfig({
          query: KPI_GROUP_DATASET_QUERY,
        }),
      },
      {
        id: VALUE_CREATION_DATASET_ID,
        config: createDeltalakeProcedureFetchDataConfig({
          functionName: VALUE_CREATION_FILTER_SP_NAME,
          parameters: [],
        }),
      },
    ];
  }

  handle(
    preset: PresetDefinition,
    datasets?: Dataset[],
    user?: UserEntity,
  ): PresetResponse {
    if (user?.policy.mode === "deny") {
      const empty: ValueCreationFilterPresetValue = {
        country: { default: {}, values: {} },
        zones: { default: {}, values: [] },
        periods: { default: {}, values: [] },
      };
      return { "value-creation": { ...preset, ...empty } };
    }

    const rows = this.extractRows(datasets);
    const rawData = [...this.buildMockData(), ...rows];
    const countryValues = this.extractCountries(rawData, user);
    const zonesValue = this.extractZones(countryValues);
    const periodsValue = this.buildPeriods(datasets);

    const countryDim: ValueCreationCountryDimension = {
      default: getDefaultCountry(countryValues),
      values: countryValues,
    };

    const zonesDim: ValueCreationZonesDimension = {
      default: getDefaultFromList(zonesValue),
      values: zonesValue,
    };

    const periodsDim: ValueCreationPeriodsDimension = {
      default: getDefaultFromList(periodsValue),
      values: periodsValue,
    };

    const payload: ValueCreationFilterPresetValue = {
      country: countryDim,
      zones: zonesDim,
      periods: periodsDim,
    };

    return { "value-creation": { ...preset, ...payload } };
  }

  private extractRows(datasets?: Dataset[]): ValueCreationFilterRawRow[] {
    const dataset = datasets?.find((d) => d.id === VALUE_CREATION_DATASET_ID);
    if (!dataset?.data?.length) {
      return [];
    }

    const out: ValueCreationFilterRawRow[] = [];
    for (const raw of dataset.data) {
      const zone = pickString(raw, ["ABI_ZONE", "abi_zone"]);
      const geography = pickString(raw, ["RAW_GEOGRAPHY", "raw_geography"]);
      const iso = pickString(raw, ["COUNTRY_ISO_CODE_3", "country_iso_code_3"]);
      const growth = pickString(raw, ["GROWTHLEVER", "growthlever"]);
      if (!zone || !geography || !iso || !growth) {
        continue;
      }
      out.push({
        ABI_ZONE: zone,
        RAW_GEOGRAPHY: geography,
        COUNTRY_ISO_CODE_3: iso,
        GROWTHLEVER: growth,
      });
    }
    return out;
  }

  /**
   * Mirrors Drupal `ValueCreation::generateMockData()` — merged before
   * SQL rows the same way as `array_merge($mockData, $dataset)`.
   */
  private buildMockData(): ValueCreationFilterRawRow[] {
    const mock: ValueCreationFilterRawRow[] = [];
    for (const growthLever of VALUE_CREATION_GROWTH_LEVERS_TEMPLATE) {
      mock.push({
        ABI_ZONE: VALUE_CREATION_GEO_ABI,
        RAW_GEOGRAPHY: VALUE_CREATION_GEO_ABI,
        COUNTRY_ISO_CODE_3: VALUE_CREATION_GEO_ABI,
        GROWTHLEVER: growthLever.value,
      });
      mock.push({
        ABI_ZONE: VALUE_CREATION_GEO_EUR,
        RAW_GEOGRAPHY: VALUE_CREATION_GEO_EUR,
        COUNTRY_ISO_CODE_3: VALUE_CREATION_GEO_ABI,
        GROWTHLEVER: growthLever.value,
      });
    }
    return mock;
  }

  private extractCountries(
    rawData: ValueCreationFilterRawRow[],
    user?: UserEntity,
  ): Record<string, ValueCreationCountryEntry[]> {
    const countries = this.initializeCountriesArray();
    const processedCountries: Record<string, ValueCreationCountryEntry> = {};

    for (const row of rawData) {
      const zone = row.ABI_ZONE;
      const country = row.RAW_GEOGRAPHY;
      const countryIsoCode = row.COUNTRY_ISO_CODE_3;
      const growthLever = row.GROWTHLEVER;

      if (!this.rowVisibleForUser(user, countryIsoCode, zone)) {
        continue;
      }

      if (!countries[zone]) {
        countries[zone] = [];
      }
      const zoneBucket = countries[zone];
      const countryIndex = zoneBucket.findIndex(
        (c) => c.value === countryIsoCode,
      );

      let idx: number;
      if (countryIndex === -1) {
        const mapped =
          VALUE_CREATION_GEO_MAPPING[zone]?.[countryIsoCode] ?? null;
        const entry: ValueCreationCountryEntry = mapped
          ? {
              value: mapped.value,
              label: mapped.label,
              quick_filter_label: mapped.quick_filter_label,
              zone: mapped.zone,
              growth_levers: mapped.growth_levers.map((g) => ({ ...g })),
              image_url: getCountryFlag(mapped.value),
            }
          : {
              value: countryIsoCode,
              label: country,
              quick_filter_label: country,
              zone,
              growth_levers: cloneGrowthLeverTemplate(),
              image_url: getCountryFlag(countryIsoCode),
            };
        zoneBucket.push(entry);
        idx = zoneBucket.length - 1;
      } else {
        idx = countryIndex;
      }

      const growthLeverIndex = zoneBucket[idx].growth_levers.findIndex(
        (g) => g.value === growthLever,
      );
      if (growthLeverIndex >= 0) {
        zoneBucket[idx].growth_levers[growthLeverIndex].disabled = false;
      }

      if (
        !(
          zone === VALUE_CREATION_GEO_ABI &&
          countryIsoCode === VALUE_CREATION_GEO_ABI
        )
      ) {
        processedCountries[countryIsoCode] = cloneCountryEntry(zoneBucket[idx]);
      }
    }

    if (countries[VALUE_CREATION_GEO_ABI]?.length) {
      const globalZoneCountries = Object.values(processedCountries)
        .filter((c) => c.value !== VALUE_CREATION_GEO_ABI)
        .sort((a, b) =>
          a.quick_filter_label.localeCompare(b.quick_filter_label),
        );

      countries[VALUE_CREATION_GEO_ABI] = [
        ...countries[VALUE_CREATION_GEO_ABI],
        ...globalZoneCountries.map(cloneCountryEntry),
      ];
    }

    return Object.fromEntries(
      Object.entries(countries).filter(([, list]) => list.length > 0),
    );
  }

  private rowVisibleForUser(
    user: UserEntity | undefined,
    countryIsoCode: string,
    zone: string,
  ): boolean {
    if (
      !user ||
      user.policy.mode === "unrestricted" ||
      user.policy.mode === "all"
    ) {
      return true;
    }
    if (user.policy.mode === "deny") {
      return false;
    }
    if (countryIsoCode === VALUE_CREATION_GEO_ABI) {
      if (zone === VALUE_CREATION_GEO_ABI) {
        // Global aggregate: `all` / `unrestricted` already returned above.
        return false;
      }
      if (zone === VALUE_CREATION_GEO_EUR) {
        return canSeeEurAggregateOption(user);
      }
      return false;
    }
    return user.hasCountryAccess(countryIsoCode);
  }

  private initializeCountriesArray(): Record<
    string,
    ValueCreationCountryEntry[]
  > {
    const zones: Record<string, ValueCreationCountryEntry[]> = {};
    for (const code of ZONE_CODES_IN_ORDER) {
      zones[code] = [];
    }
    return zones;
  }

  private extractZones(
    countries: Record<string, ValueCreationCountryEntry[]>,
  ): ValueCreationZoneOption[] {
    const zones: ValueCreationZoneOption[] = [];
    for (const [zone, countriesInZone] of Object.entries(countries)) {
      if (countriesInZone.length > 0) {
        zones.push({
          full: "",
          label: zone === VALUE_CREATION_GEO_ABI ? "Global" : zone,
          value: zone,
          image_url: getCountryFlag(zone),
        });
      }
    }
    return zones;
  }

  private buildPeriods(datasets?: Dataset[]): ValueCreationPeriodOption[] {
    const queried = kpiGroupHandler.handle({}, datasets);
    const fromQuery =
      typeof queried.volume === "string" && queried.volume.length > 0
        ? queried.volume
        : "";
    const refresh = fromQuery || (kpiGroupTimeFrame.config.volume ?? "");
    return generateMonthlyTimeframes(refresh);
  }
}

function cloneCountryEntry(
  entry: ValueCreationCountryEntry,
): ValueCreationCountryEntry {
  return {
    ...entry,
    growth_levers: entry.growth_levers.map((g) => ({ ...g })),
  };
}

function pickString(raw: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = raw[key];
    if (typeof v === "string" && v.length > 0) {
      return v;
    }
  }
  return "";
}

function getDefaultCountry(
  values: Record<string, ValueCreationCountryEntry[]>,
): ValueCreationCountryEntry | Record<string, never> {
  const orderedKeys = ZONE_CODES_IN_ORDER.filter(
    (k) => (values[k] ?? []).length > 0,
  );
  if (orderedKeys.length === 0) {
    return {};
  }
  const firstBucket = values[orderedKeys[0]];
  if (!firstBucket?.length) {
    return {};
  }
  return cloneCountryEntry(firstBucket[0]);
}

function getDefaultFromList<T>(list: T[]): T | Record<string, never> {
  if (list.length === 0) {
    return {};
  }
  return { ...(list[0] as object) } as T;
}

/**
 * EUR zone aggregate row ("All Europe"), for explicit policy only
 * (`all` / `unrestricted` are handled in {@link ValueCreationPresetHandler.rowVisibleForUser}).
 */
function canSeeEurAggregateOption(user: UserEntity): boolean {
  if (user.policy.mode !== "explicit") {
    return false;
  }
  if (user.scopes.includes(VIEWER_SCOPES.ZONE.EUR)) {
    return true;
  }
  return coversEveryCountryInZone(user.policy.iso3Set, VALUE_CREATION_GEO_EUR);
}

function coversEveryCountryInZone(
  iso3Set: Set<string>,
  zoneId: string,
): boolean {
  const inZone = resolveCountriesByZone(zoneId);
  return inZone.length > 0 && inZone.every((c) => iso3Set.has(c.id));
}

/**
 * Port of Drupal `Period::getMonthlyTimeframes` using `kpi_group_time_frame.volume`
 * (`DD-MM-YYYY`), same refresh source as Drupal `ValueCreation::generateTimeframes`.
 */
function generateMonthlyTimeframes(
  volumeRefreshDateDdMmYyyy: string,
): ValueCreationPeriodOption[] {
  const parts = volumeRefreshDateDdMmYyyy.split("-");
  if (parts.length !== 3) {
    return [];
  }
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);
  if (![day, month, year].every(Number.isFinite)) {
    return [];
  }
  const utcMs = Date.UTC(year, month - 1, day);
  const cal = new Date(utcMs);
  if (
    cal.getUTCFullYear() !== year ||
    cal.getUTCMonth() !== month - 1 ||
    cal.getUTCDate() !== day
  ) {
    return [];
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDateEnd = `${months[cal.getUTCMonth()]}'${String(year).slice(2)}`;

  return [
    {
      value: "YTD",
      label: `YTD ${formattedDateEnd}`,
      full: "Year To Date (YTD)",
    },
    {
      value: "L3M",
      label: `L3M ${formattedDateEnd}`,
      full: "Last 3 Months (L3M)",
    },
    {
      value: "MTD",
      label: formattedDateEnd,
      full: "Month To Date (MTD)",
    },
  ];
}

export const valueCreationHandler = new ValueCreationPresetHandler();
