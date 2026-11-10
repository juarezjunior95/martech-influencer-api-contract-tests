# Presets (RFC-003 PoC) — Data-Service

This document covers the Data-Service side of the Presets System. Read
`arch-docs/rfc/RFC-003-develop-filter-with-country-permissions-updated.md`
for the full design; this is a how-to.

## What is a preset?

A preset is a named bundle of filters and auxiliary configuration for a
specific page/context, e.g. `brands` or `years`. A preset response is
flat JSON where each key is either:

- A **filter item** with `label`, `options`, and optional `defaultValue`.
- A **primitive** (string/number/boolean) configuration value.

Presets are declarative: you describe them in TypeScript, the
`PresetEntity` pipeline does the rest.

## How to add a preset

A preset is a self-contained folder under `src/domain/config/presets/<name>/`.
Only one file is required: the config (`<name>.preset.ts`). Everything
else is optional and lives in the same folder.

> Trivial presets (no handler, no shared types, no defaults table) may
> use the flat layout `src/domain/config/presets/<name>.preset.ts`
> instead. See [`example.preset.ts`](src/domain/config/presets/example.preset.ts)
> for a single-file static preset; everything in this section still
> applies to it (overrides, country expansion, country trim) — there is
> just nothing handler-specific to wire.

```
src/domain/config/presets/<name>/
├── <name>.preset.ts        # required: config object, default export
├── <name>.types.ts         # optional: shared types for the config + handler
├── <name>.handler.ts       # optional: dataset declaration + transform
└── <name>.defaults.ts      # optional: any static lookup tables
```

`PresetEntity` is generic. It loads the config by name (folder layout
or flat layout), parses namespaced query overrides, expands country
references, runs your handler, and trims country options. **It never
needs to be edited when you add a new filter type** — every filter
specific concern lives in your folder.

### Adding a new filter type — what goes where

| Concern | Owner |
| ------- | ----- |
| Query-string parsing (snake -> camel, scalar/comma coercion) | `preset.entity.ts` (generic, reused by every filter) |
| `?ns[name]=value` -> `preset[ns][name]` | `preset.entity.ts` (uniform; nothing is promoted to root) |
| Country expansion + country permission trim | `preset.entity.ts` (the one global JWT-driven boundary) |
| Country-keyed map trimming for handlers | `preset.entity.ts` exports `trimByCountryAccess` |
| Idempotent dataset injection | `preset.entity.ts` exports `ensureDataset`; handler declares its dataset via `IPresetHandler.datasets()` |
| Filter-specific types (e.g. `BrandFilterItem`) | `<name>/<name>.types.ts` |
| Filter-specific transforms (e.g. country->brands tree) | `<name>/<name>.handler.ts` |
| Filter-specific override validation | inside the handler's `handle()` |

### Minimal example (see `years/years.preset.ts`)

```ts
import { PresetConfig } from "@domain/entities/preset.entity";
import {
  yearsHandler,
  YearsPresetConfig,
} from "@domain/config/presets/years/years.handler";

// `?years[no_default]=true` merges into preset.years.noDefault
const yearsPreset: { years: YearsPresetConfig } = {
  years: { noDefault: false },
};

const config: PresetConfig<typeof yearsPreset> = {
  version: "1.0.0",
  handler: yearsHandler,
  preset: yearsPreset,
};

export default config;
```

#### Years response shape

The handler emits the legacy Drupal `FilterValuesDto` payload:

```jsonc
{
  "years": {
    "values": [
      { "value": "2025", "label": "FY'25", "full": "Full Year (FY)" },
      { "value": "2024", "label": "FY'24", "full": "Full Year (FY)" },
      // ... newest-first, range driven by env vars below
    ],
    "default": { "value": "2025", "label": "FY'25", "full": "Full Year (FY)" },
    "enabled": true
  }
}
```

When `?years[no_default]=true` the `default` collapses to `{}`, mirroring
the legacy `selectDefaultSegment` behavior in [`FullYears.php`](../acquia-drupal/docroot/modules/custom/abinbev_oneway_reports/src/Plugin/Filter/FullYears.php).
The override merges into `preset.years.noDefault` like every other
namespaced query (no special root-level promotion).

### Static config groups

Static, page-agnostic configuration values (year bounds, default
segments, ...) live in plain TS files under
`src/domain/config/config-groups/`. They are ports of the legacy Drupal
"config bag" concept (e.g. `kpi_group_time_frame`). Every file exports a
`ConfigGroup<T>` default export:

```ts
{
  name: "kpi_group_time_frame",
  config: {
    cat_health_start_year: 2025,
    cat_health_end_year: 2021,
  },
}
```

Rules:

- One file per legacy group; sub-keys keep their snake_case name for
  parity with the Drupal source.
- Presets import the group **directly** (`import kpiGroupTimeFrame
  from "@domain/config/config-groups/kpi-group-time-frame.config"`) —
  there is no runtime registry, no name-string lookup.
- The preset is responsible for mapping legacy keys onto the
  chronological / handler-friendly fields it owns. For example, the
  Drupal `kpi_group_time_frame.cat_health_start_year` is the *newest*
  year (legacy naming inversion); `years.preset.ts` swaps it onto
  `endYear` so the handler still receives `start <= end`.

See [`years/years.preset.ts`](src/domain/config/presets/years/years.preset.ts)
for the canonical example.

### Country references

Use the `countries: string[]` shape to reference the central registry.
The pipeline expands `["*"]` to the full registry and silently drops
unknown ids.

```ts
country: { label: "Country", countries: ["BRA", "ARG", "MEX"] },
```

### Brand filter

Brands are **not** a static registry; they are sourced from Databricks
via the `brand-subbrands` query and shaped to mirror the legacy Drupal
`Brands` plugin response (country -> brands -> sub_brands -> defaults).

The dedicated [presets/brands/brands.preset.ts](src/domain/config/presets/brands/brands.preset.ts)
config (endpoint `GET /v1/presets/brands`) is the canonical example.
Authors compose the filter declaratively:

```ts
brand: {
  label: "Brand",
  source: "databricks",
  includeGlobal: true,        // synthetic ABI row (default: false)
  includeAllBrands: true,     // prepend "All" brand per country (default: true)
  includeSubBrands: true,     // emit sub_brands on every brand (default: true)
  includeAllSubBrands: true,  // prepend "All" sub-brand per brand (default: true)
  flatten: false,             // emit a flat brand+sub_brand list (default: false)
  fieldLabel: "Brand",        // optional column-title row at the top
  subFieldLabel: "Sub-brand", // optional column-title row in sub_brands
  countries: ["BRA", "ARG"],  // optional pre-filter, applied before permission trim
}
```

Wiring lives in `brands/brands.handler.ts`:

- `brandsHandler.datasets()` returns the `brand-subbrands` Databricks
  query, which `PresetEntity` merges into `config.datasets` before
  loading datasets (idempotent by `id`).
- `brandsHandler.handle()` walks the preset, replaces every
  `BrandFilterItem` entry with the legacy nested `BrandPresetValue`
  payload, validates the
  `include_all_sub_brands`/`include_sub_brands` conflict, and trims
  `values` per country access via the entity's generic
  `trimByCountryAccess` helper.

`PresetEntity` itself never imports brand-specific code.

#### Per-request overrides (legacy Drupal query shape)

Override rule (uniform across every preset):

- `?ns[name]=value` always merges into `preset.ns.name`.
- snake_case URL keys are mapped to camelCase TypeScript fields.
- Values are coerced: `"true"`/`"false"` -> boolean, decimal/integer
  strings -> number, comma-containing strings -> trimmed `string[]`.
- The legacy `?filter[*]` shape is forwarded to `loadDatasets` and
  ignored as an override.
- Nothing is promoted to the preset root.

Brand fields ([Brands.php](../acquia-drupal/docroot/modules/custom/abinbev_oneway_reports/src/Plugin/Filter/Brands.php) reference):

| URL key                          | Type            | TypeScript field      |
| -------------------------------- | --------------- | --------------------- |
| `brand[include_global]`          | boolean         | `includeGlobal`       |
| `brand[include_all_brands]`      | boolean         | `includeAllBrands`    |
| `brand[include_sub_brands]`      | boolean         | `includeSubBrands`    |
| `brand[include_all_sub_brands]`  | boolean         | `includeAllSubBrands` |
| `brand[flatten]`                 | boolean         | `flatten`             |
| `brand[field_label]`             | string          | `fieldLabel`          |
| `brand[sub_field_label]`         | string          | `subFieldLabel`       |
| `brand[countries]`               | CSV (`BRA,ARG`) | `countries`           |

Years preset:

| URL key            | Type    | Effect                                              |
| ------------------ | ------- | --------------------------------------------------- |
| `years[no_default]` | boolean | Suppress the auto-selected default fiscal year.    |

Conflict guard: `brand[include_all_sub_brands]=true` combined with
`brand[include_sub_brands]=false` returns HTTP 400, mirroring the
legacy `InvalidFilterConfigException`.

#### Response shape

```jsonc
{
  "brand": {
    "label": "Brand",
    "enabled": true,
    "default": [],
    "values": {
      "ABI": { /* only when includeGlobal === true */
        "brands": [{
          "value": "All", "label": "All",
          "default": { "value": "All", "label": "All" },
          "sub_brands": [{ "value": "All", "label": "All" }]
        }],
        "default": {
          "value": "All", "label": "All",
          "sub_brands": [{ "value": "All", "label": "All" }],
          "default": { "value": "All", "label": "All" }
        }
      },
      "ARG": {
        "brands": [
          { "value": "All", "label": "All", "sub_brands": [...], "default": {...} },
          { "value": "Andes", "label": "Andes", "sub_brands": [...], "default": {...} },
          ...
        ],
        "default": { "value": "All", "label": "All", ... }
      }
    }
  }
}
```

Per-country defaults come from
`src/domain/config/presets/brands/brands.defaults.ts`
(ported verbatim from Drupal's
`Brand::$auxiliatyBrandCountryDictionary`). Today every country
defaults to `"All"`.

## Registries

`src/domain/registries/` holds the canonical country catalog:

- `countries.registry.ts` — `{ id, iso2, title, zone, flag_icon, match_names }`.
- `zones.registry.ts` — `{ id, title, scope }` (scope strings sourced from `scopes.ts`).
- `resolver.ts` — `resolveCountries(ids)`, `resolveCountryByIso2(iso2)`,
  `resolveCountriesByZone(zone)`.

Add new entries by appending to `rawEntries` in the respective registry
file. Icons are derived from the existing image utilities, so they stay
in sync with the rest of the service.

## Permission filtering

Country filter items are trimmed by a scope-aware policy resolved from
the JWT (`scopes`, `country`, `supportedCountries`). The decoded
`UserEntity` is produced by the request-scoped `CurrentUserRepository`
from the `Authorization` header stored in `HeaderContextService`.

Brand filters are **not** a permission boundary — they are dataset-driven
filters from Databricks. The country trim is reused on the brand
`values` map (each ISO3 key is dropped if `user.hasCountryAccess` says
no), but no separate `supportedBrands` claim is consulted. The synthetic
`ABI` row is preserved in `explicit` modes (zone/country viewers) and
dropped only in `deny` mode.

### Precedence

| Order | Trigger | Mode | Effective country set |
|---|---|---|---|
| 1 | `OneWayReports.GlobalViewer.Read` | `all` | every country |
| 2 | one or more `OneWayReports.{Zone}Viewer.Read` | `explicit` | union of countries from each granted zone, **plus** the JWT `country` claim (ISO3) added unconditionally |
| 3 | `OneWayReports.CountryViewer.Read` | `explicit` | union of `supportedCountries` (ISO2→ISO3) with the JWT `country` claim (ISO3). Empty union collapses to `deny`. |
| 4 | JWT present, none of the above | `deny` | empty |
| 5 | JWT missing/invalid | `unrestricted` | every country (PoC graceful degradation) |

`GlobalViewer` always wins. `ZoneViewer` wins over `CountryViewer` when
both are present.

### Scope → Zone mapping

| JWT scope | Zone code |
|---|---|
| `OneWayReports.AfricaViewer.Read` | `AFR` |
| `OneWayReports.AsiaPacificViewer.Read` | `APAC` |
| `OneWayReports.EuropeViewer.Read` | `EUR` |
| `OneWayReports.MiddleAmericasViewer.Read` | `MAZ` |
| `OneWayReports.NorthAmericasViewer.Read` | `NAZ` |
| `OneWayReports.SouthAmericasViewer.Read` | `SAZ` |

The mapping lives in `src/domain/registries/zones.registry.ts` and the
scope constants are exposed by `src/domain/entities/scopes.ts`.

### ISO2 ↔ ISO3

Presets and registries speak ISO3 (`BRA`, `USA`, …). The JWT
`supportedCountries` claim is ISO2 (`BR`, `US`, …) and the `country`
claim accepts either form. `UserEntity.create()` translates ISO2 to
ISO3 using `resolveCountryByIso2`; codes unknown to the registry are
silently dropped.

### Examples

```text
# GlobalViewer — always sees everything
scopes:              [OneWayReports.GlobalViewer.Read]
country:             BR
supportedCountries:  [BR]
=> mode=all, every country option is returned

# ZoneViewer (single zone) + home country outside the zone
scopes:              [OneWayReports.AfricaViewer.Read]
country:             BR
supportedCountries:  []
=> mode=explicit, set = AFR countries ∪ {BRA}

# ZoneViewer (multiple zones) — union
scopes:              [OneWayReports.AfricaViewer.Read,
                      OneWayReports.EuropeViewer.Read]
country:             null
=> mode=explicit, set = AFR countries ∪ EUR countries

# CountryViewer — supportedCountries ∪ JWT country
scopes:              [OneWayReports.CountryViewer.Read]
country:             BR
supportedCountries:  [BR, US]
=> mode=explicit, set = {BRA, USA}

# CountryViewer — JWT country outside supportedCountries is still added
scopes:              [OneWayReports.CountryViewer.Read]
country:             BR
supportedCountries:  [US]
=> mode=explicit, set = {USA, BRA}

# CountryViewer — empty union collapses to deny
scopes:              [OneWayReports.CountryViewer.Read]
country:             null
supportedCountries:  []
=> mode=deny, country options are emptied

# JWT present but no viewer scope — deny
scopes:              [OneWayReports.TradeExecution.Read]
country:             BR
supportedCountries:  [BR]
=> mode=deny, country options are emptied

# JWT missing — backward compat
=> mode=unrestricted, every country option is returned
```

## Running the PoC

```bash
# 1. Install deps (requires a working npm registry for `jwt-decode`):
npm install

# 2. Build & start
npm run start:dev

# 3. Hit the endpoint (JWT is decoded but not verified; Istio/API Gateway
#    handles verification upstream):
curl -H "Authorization: Bearer <JWT_WITH_supportedCountries>" \
  "http://localhost:3000/v1/presets/brands"

# Suppress the default year (legacy `?years[no_default]=true` query shape)
curl "http://localhost:3000/v1/presets/years?years[no_default]=true"

# Tweak brand response per-request: drop the synthetic ABI row,
# narrow to two countries, and flatten the brand+sub_brand list.
curl "http://localhost:3000/v1/presets/brands?brand[include_global]=false&brand[countries]=BRA,ARG&brand[flatten]=true"

# Demo preset — static `{ examples: [...] }` payload. The BFF layer
# applies a JSONata formatter that sorts `health: "good"` first; the
# data-service itself returns the entries in author order.
curl "http://localhost:3000/v1/presets/example"
```

The `years` preset reads its bounds from
[`kpi-group-time-frame.config.ts`](src/domain/config/config-groups/kpi-group-time-frame.config.ts)
(see "Static config groups" above). Edit that file to change the year
range; no env vars are involved.

## File map

```
martech-oneway-reports-data-service/
├── src/domain/
│   ├── config/
│   │   ├── config-groups/                    # static config bags ported from Drupal
│   │   │   ├── config-group.types.ts         #   shared `ConfigGroup<T>` shape
│   │   │   └── kpi-group-time-frame.config.ts#   year bounds for the `years` preset
│   │   └── presets/                          # one folder per preset
│   │       ├── brands/                       # GET /v1/presets/brands
│   │       │   ├── brands.preset.ts          #   config (default export)
│   │       │   ├── brands.types.ts           #   BrandFilterItem, BrandPresetValue, ...
│   │       │   ├── brands.handler.ts         #   datasets() + transform + validation
│   │       │   └── brands.defaults.ts        #   per-country default brand
│   │       ├── years/                        # GET /v1/presets/years
│   │       │   ├── years.preset.ts           #   config (default export); reads kpi_group_time_frame
│   │       │   └── years.handler.ts          #   YearTuple, YearPresetValue, transform
│   │       └── example.preset.ts             # GET /v1/presets/example (flat-file demo)
│   ├── entities/
│   │   ├── preset.entity.ts                  # generic pipeline + country built-in + helpers
│   │   ├── scopes.ts                         # VIEWER_SCOPES constants
│   │   └── user.entity.ts                    # JWT-driven CountryAccessPolicy
│   ├── interfaces/
│   │   └── preset-handler.interface.ts       # IPresetHandler (with optional datasets())
│   └── registries/
│       ├── countries.registry.ts
│       ├── zones.registry.ts
│       └── resolver.ts
└── src/infrastructure/sql/databricks/
    └── presets/brand/brand-subbrands.sql     # filter_brand-subbrands query
```
